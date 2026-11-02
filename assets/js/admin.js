// ============================================================
//  ESPACE ADMINISTRATION (admin.html)
//  La vraie protection est dans firestore.rules : même si quelqu'un
//  modifie ce fichier, il ne peut rien lire ni écrire sans les droits.
// ============================================================
import { getDB, can, isAdmin, PERMISSIONS, STATUSES } from "./db.js";
import { CONFIG } from "./config.js";
import { ICONS, ICON_CHOICES, icon, logoMark } from "./icons.js";
import { esc, formatPrice, slugify, digitsOnly, toIntl, safeUrl, clip, lines, fmtDate, timeAgo, toMillis, debounce } from "./utils.js";
import { DEFAULT_CONTENT } from "./defaults.js";

// Empêche l'affichage de l'admin dans un cadre (protection anti-clickjacking)
if (window.top !== window.self) { document.body.textContent = ""; throw new Error("Affichage dans un cadre refusé."); }

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const root = $("#root");

const S = { db: null, user: null, settings: {}, content: {}, packs: [], requests: [], users: [], view: "dashboard", filter: "new", search: "" };
const statusLabel = (k) => STATUSES.find((s) => s.key === k)?.label || k;
const stChip = (k) => `<span class="st st-${esc(k)}">${esc(statusLabel(k))}</span>`;
const roleLabel = (r) => (r === "admin" ? "Administrateur" : "Technicien");

// ---------- Outils d'interface ----------
function toast(msg, error = false) {
  const el = document.createElement("div");
  el.className = "toast" + (error ? " err" : "");
  el.innerHTML = `${error ? ICONS.info : ICONS.checkCircle}<span>${esc(msg)}</span>`;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

function modal({ title, body, foot = "", size = "" }) {
  const wrap = document.createElement("div");
  wrap.className = "modal-wrap";
  wrap.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" type="button" data-x aria-label="Fermer">${ICONS.x}</button></div>
    <div class="modal-body">${body}</div>
    ${foot ? `<div class="modal-foot">${foot}</div>` : ""}
  </div>`;
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";
  const onKey = (e) => { if (e.key === "Escape") close(); };
  const close = () => { wrap.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  document.addEventListener("keydown", onKey);
  wrap.addEventListener("mousedown", (e) => { if (e.target === wrap) close(); });
  $$("[data-x]", wrap).forEach((b) => b.addEventListener("click", close));
  setTimeout(() => $("input, select, textarea", wrap)?.focus(), 30);
  return { el: wrap, close };
}

function confirmBox(message, { ok = "Confirmer", danger = true } = {}) {
  return new Promise((resolve) => {
    const m = modal({
      title: "Confirmation",
      body: `<p>${esc(message)}</p>`,
      foot: `<button class="btn btn-outline" data-x>Annuler</button><button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-ok>${esc(ok)}</button>`
    });
    let done = false;
    $("[data-ok]", m.el).addEventListener("click", () => { done = true; m.close(); resolve(true); });
    new MutationObserver((_, obs) => { if (!document.body.contains(m.el)) { obs.disconnect(); if (!done) resolve(false); } })
      .observe(document.body, { childList: true });
  });
}

async function busy(btn, fn) {
  const html = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>`;
  try { return await fn(); }
  catch (e) { toast(e.message || "Erreur", true); return undefined; }
  finally { btn.disabled = false; btn.innerHTML = html; }
}

const field = (label, name, value = "", { type = "text", max = 200, hint = "", attrs = "", textarea = false, rows = 3, dir = "" } = {}) => `
  <div class="field"><label for="f_${name}">${esc(label)}</label>
  ${textarea
    ? `<textarea class="textarea" id="f_${name}" name="${name}" maxlength="${max}" rows="${rows}" ${dir ? `dir="${dir}"` : ""} ${attrs}>${esc(value)}</textarea>`
    : `<input class="input" id="f_${name}" name="${name}" type="${type}" maxlength="${max}" value="${esc(value)}" ${dir ? `dir="${dir}"` : ""} ${attrs}>`}
  ${hint ? `<span class="hint">${esc(hint)}</span>` : ""}</div>`;

// Champ bilingue FR / AR côte à côte
const bi = (label, key, obj = {}, opts = {}) => `
  <div><span class="bi-label">${esc(label)}</span><div class="bi">
    ${field("FRANÇAIS", `${key}_fr`, obj[`${key}_fr`] || "", opts).replace('<label', '<label class="lang-tag"')}
    ${field("ARABE", `${key}_ar`, obj[`${key}_ar`] || "", { ...opts, dir: "rtl" }).replace('<label', '<label class="lang-tag"')}
  </div></div>`;

const iconSelect = (name, value) => `<select class="select" name="${name}">${ICON_CHOICES.map(([k, l]) => `<option value="${k}" ${k === value ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
const formVals = (form) => Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]));

// ---------- Déconnexion automatique après inactivité ----------
let idleTimer = null;
function armIdle() {
  const ms = (CONFIG.adminIdleMinutes || 30) * 60_000;
  const reset = debounce(() => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(async () => { await S.db.signOut(); toast("Déconnecté après une période d'inactivité."); }, ms);
  }, 500);
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
  reset();
}

// ============================================================
//  ÉCRANS D'ACCÈS
// ============================================================
function authShell(inner) {
  root.innerHTML = `${S.db?.mode === "demo" ? `<div class="demo-banner">MODE DÉMO LOCAL — admin@demo.local / demo-admin-2026</div>` : ""}
  <div class="auth-wrap"><div class="auth-card">
    <div class="logo">${logoMark()}<span>${esc(S.settings.brand || "Administration")}</span></div>
    ${inner}
    <p class="secure-note">${ICONS.lock}Connexion chiffrée · session fermée après ${CONFIG.adminIdleMinutes || 30} min d'inactivité</p>
  </div></div>`;
}

function screenLogin() {
  authShell(`<h1>Connexion</h1><p>Espace réservé à l'équipe.</p>
    <form id="loginForm" novalidate>
      ${field("Email", "email", "", { type: "email", max: 120, attrs: 'autocomplete="username" required' })}
      ${field("Mot de passe", "password", "", { type: "password", max: 128, attrs: 'autocomplete="current-password" required' })}
      <div class="form-error" id="loginErr" role="alert" hidden></div>
      <button class="btn btn-primary btn-block" type="submit">Se connecter</button>
    </form>
    <div class="auth-foot"><button class="link-btn" id="forgot" type="button">Mot de passe oublié ?</button><a href="./">← Voir le site</a></div>`);
  const form = $("#loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { email, password } = formVals(form);
    const err = $("#loginErr");
    err.hidden = true;
    if (!email || !password) { err.textContent = "Remplissez l'email et le mot de passe."; err.hidden = false; return; }
    await busy(form.querySelector("button[type=submit]"), async () => {
      try { await S.db.signIn(email, password); }
      catch (ex) { err.textContent = ex.message; err.hidden = false; }
    });
  });
  $("#forgot").addEventListener("click", async () => {
    const email = form.elements.email.value.trim();
    if (!email) { toast("Écrivez d'abord votre email.", true); form.elements.email.focus(); return; }
    try { await S.db.resetPassword(email); toast("Si ce compte existe, un email de réinitialisation a été envoyé."); }
    catch (ex) { toast(ex.message, true); }
  });
}

function screenSetup() {
  authShell(`<h1>Bienvenue</h1><p>Créez le compte administrateur principal. Cet écran n'apparaît qu'une seule fois.</p>
    <form id="setupForm" novalidate>
      ${field("Votre nom", "name", "", { max: 80, attrs: "required" })}
      ${field("Email", "email", "", { type: "email", max: 120, attrs: 'autocomplete="username" required' })}
      ${field("Mot de passe", "password", "", { type: "password", max: 128, attrs: 'autocomplete="new-password" required', hint: "12 caractères minimum, avec majuscule, minuscule et chiffre." })}
      <div class="form-error" id="setupErr" role="alert" hidden></div>
      <button class="btn btn-primary btn-block" type="submit">Créer le compte administrateur</button>
    </form>`);
  const form = $("#setupForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = formVals(form);
    const err = $("#setupErr");
    const pw = passwordProblem(v.password);
    if (!v.name || !v.email) { err.textContent = "Remplissez tous les champs."; err.hidden = false; return; }
    if (pw) { err.textContent = pw; err.hidden = false; return; }
    await busy(form.querySelector("button[type=submit]"), async () => {
      try { await S.db.setupAdmin(v); location.reload(); }
      catch (ex) { err.textContent = ex.message; err.hidden = false; }
    });
  });
}

function screenDenied(user) {
  authShell(`<h1>Accès refusé</h1>
    <p>Le compte <strong>${esc(user.email || "")}</strong> n'a pas (ou plus) accès à l'administration. Contactez l'administrateur.</p>
    <div class="auth-foot"><button class="btn btn-outline btn-block" id="out">Se déconnecter</button></div>`);
  $("#out").addEventListener("click", () => S.db.signOut());
}

export function passwordProblem(pw = "") {
  if (pw.length < 12) return "Le mot de passe doit contenir au moins 12 caractères.";
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw)) return "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.";
  return "";
}

// ============================================================
//  STRUCTURE
// ============================================================
const NAV = [
  { key: "dashboard", label: "Tableau de bord", icon: "grid", ok: () => true },
  { key: "requests", label: "Demandes", icon: "inbox", ok: (u) => can(u, "requests.view") },
  { key: "packs", label: "Packs et prix", icon: "layers", ok: (u) => can(u, "packs.edit") },
  { key: "content", label: "Contenu du site", icon: "fileText", ok: (u) => can(u, "content.edit") },
  { key: "settings", label: "Coordonnées", icon: "settings", ok: (u) => isAdmin(u) },
  { key: "users", label: "Utilisateurs", icon: "users", ok: (u) => isAdmin(u) },
  { key: "account", label: "Mon compte", icon: "key", ok: () => true }
];

function renderShell() {
  const u = S.user;
  const newCount = S.requests.filter((r) => r.status === "new").length;
  root.innerHTML = `${S.db.mode === "demo" ? `<div class="demo-banner">MODE DÉMO LOCAL — les données restent dans ce navigateur</div>` : ""}
  <div class="shell">
    <aside class="sidebar" id="sidebar">
      <div class="side-brand">${logoMark()}<div><strong>${esc(S.settings.brand)}</strong><small>Administration</small></div></div>
      <nav class="side-nav">${NAV.filter((n) => n.ok(u)).map((n) => `
        <button type="button" data-view="${n.key}" class="${S.view === n.key ? "active" : ""}">${ICONS[n.icon]}${n.label}
        ${n.key === "requests" && newCount ? `<span class="count">${newCount}</span>` : ""}</button>`).join("")}
      </nav>
      <div class="side-foot">
        <div class="me"><span class="avatar">${esc((u.name || u.email || "?").charAt(0).toUpperCase())}</span>
          <div><strong>${esc(u.name || u.email)}</strong><small>${roleLabel(u.role)}</small></div></div>
        <nav class="side-nav">
          <a href="./" target="_blank" rel="noopener">${ICONS.external}Voir le site</a>
          <button type="button" id="logout">${ICONS.logout}Déconnexion</button>
        </nav>
      </div>
    </aside>
    <div class="scrim" id="scrim" hidden></div>
    <div class="main">
      <div class="topbar"><button class="icon-btn" id="menuBtn" aria-label="Menu">${ICONS.menu}</button><strong>${esc(S.settings.brand)}</strong></div>
      <div class="content" id="view"></div>
    </div>
  </div>`;
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => go(b.dataset.view)));
  $("#logout").addEventListener("click", () => S.db.signOut());
  const side = $("#sidebar"), scrim = $("#scrim");
  $("#menuBtn").addEventListener("click", () => { side.classList.add("open"); scrim.hidden = false; });
  scrim.addEventListener("click", () => { side.classList.remove("open"); scrim.hidden = true; });
  renderView();
}

function go(view) {
  if (!NAV.find((n) => n.key === view)?.ok(S.user)) view = "dashboard";
  S.view = view;
  try { sessionStorage.setItem("adm_view", view); } catch {}
  renderShell();
  window.scrollTo(0, 0);
}

function renderView() {
  const v = $("#view");
  ({ dashboard: viewDashboard, requests: viewRequests, packs: viewPacks, content: viewContent, settings: viewSettings, users: viewUsers, account: viewAccount }[S.view] || viewDashboard)(v);
}

async function reload(what = ["requests", "packs", "settings", "content"]) {
  const u = S.user;
  const jobs = [];
  if (what.includes("settings")) jobs.push(S.db.getSettings().then((x) => (S.settings = x)));
  if (what.includes("content")) jobs.push(S.db.getContent().then((x) => (S.content = x)));
  if (what.includes("packs")) jobs.push(S.db.listPacks({ all: true }).then((x) => (S.packs = x)));
  if (what.includes("requests") && can(u, "requests.view")) jobs.push(S.db.listRequests().then((x) => (S.requests = x)));
  if (what.includes("users") && isAdmin(u)) jobs.push(S.db.listUsers().then((x) => (S.users = x)));
  const res = await Promise.allSettled(jobs);
  const failed = res.find((r) => r.status === "rejected");
  if (failed) toast(failed.reason?.message || "Chargement incomplet.", true);
}

// ============================================================
//  TABLEAU DE BORD
// ============================================================
function viewDashboard(v) {
  const u = S.user;
  const R = S.requests;
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const doneMonth = R.filter((r) => r.status === "done" && toMillis(r.updatedAt || r.createdAt) >= monthStart.getTime());
  const hello = (u.name || "").split(" ")[0];
  v.innerHTML = `
    <div class="page-title"><div><h1>Bonjour ${esc(hello)}</h1><p>Voici l'activité de votre service.</p></div>
      ${can(u, "requests.view") ? `<div class="actions"><button class="btn btn-outline btn-sm" id="refresh">Actualiser</button></div>` : ""}</div>
    ${can(u, "requests.view") ? `
    <div class="kpis">
      <div class="kpi new"><span>Nouvelles demandes</span><strong>${R.filter((r) => r.status === "new").length}</strong></div>
      <div class="kpi"><span>En cours</span><strong>${R.filter((r) => r.status === "progress").length}</strong></div>
      <div class="kpi"><span>Résolues ce mois</span><strong>${doneMonth.length}</strong></div>
      <div class="kpi"><span>Chiffre du mois</span><strong>${esc(formatPrice(doneMonth.reduce((s, r) => s + (Number(r.price) || 0), 0)))}</strong></div>
    </div>
    <div class="panel">
      <div class="panel-head"><div><h2>Dernières demandes</h2></div><button class="btn btn-outline btn-sm" data-go="requests">Tout voir</button></div>
      <div class="rows">${R.slice(0, 6).map(rowHTML).join("") || `<div class="empty">Aucune demande pour l'instant.</div>`}</div>
    </div>` : `<div class="panel"><div class="panel-body">Utilisez le menu pour accéder aux sections autorisées pour votre compte.</div></div>`}`;
  $("[data-go]", v)?.addEventListener("click", () => go("requests"));
  $("#refresh", v)?.addEventListener("click", async (e) => { await busy(e.currentTarget, () => reload(["requests"])); renderShell(); });
  bindRows(v);
}

// ============================================================
//  DEMANDES
// ============================================================
function rowHTML(r) {
  return `<button type="button" class="row-item" data-req="${esc(r.id)}">
    <span class="id">${esc(r.id)}<small>${esc(timeAgo(r.createdAt))}</small></span>
    <span class="who"><strong>${esc(r.name)}</strong><small>${esc([r.company, r.city].filter(Boolean).join(" · "))}</small></span>
    <span class="prob">${esc(r.category)} — ${esc(r.problem)}</span>
    <span><span class="tag ${r.mode === "onsite" ? "onsite" : r.packId === "urgent" ? "urgent" : "remote"}">${esc(r.packName || r.packId)}</span></span>
    <span>${stChip(r.status)}</span>
  </button>`;
}
function bindRows(v) {
  $$("[data-req]", v).forEach((b) => b.addEventListener("click", () => openRequest(b.dataset.req)));
}

function viewRequests(v) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s.key, S.requests.filter((r) => r.status === s.key).length]));
  v.innerHTML = `
    <div class="page-title"><div><h1>Demandes</h1><p>Toutes les demandes envoyées depuis le site.</p></div>
      <div class="actions"><button class="btn btn-outline btn-sm" id="exportCsv">${ICONS.download}Exporter (CSV)</button>
      <button class="btn btn-outline btn-sm" id="refresh">Actualiser</button></div></div>
    <div class="panel">
      <div class="filters">
        <div class="tabs">
          ${STATUSES.map((s) => `<button type="button" data-f="${s.key}" class="${S.filter === s.key ? "active" : ""}">${s.label}<em>${counts[s.key]}</em></button>`).join("")}
          <button type="button" data-f="all" class="${S.filter === "all" ? "active" : ""}">Toutes<em>${S.requests.length}</em></button>
        </div>
        <div class="search"><input class="input" id="q" type="search" placeholder="Rechercher (nom, téléphone, n°…)" value="${esc(S.search)}"></div>
      </div>
      <div class="rows" id="rows"></div>
    </div>`;
  const draw = () => {
    const q = S.search.toLowerCase();
    const list = S.requests.filter((r) => (S.filter === "all" || r.status === S.filter) &&
      (!q || [r.id, r.name, r.company, r.phone, r.city, r.problem, r.category].join(" ").toLowerCase().includes(q)));
    $("#rows").innerHTML = list.map(rowHTML).join("") || `<div class="empty">Aucune demande ici.</div>`;
    bindRows($("#rows"));
  };
  $$("[data-f]", v).forEach((b) => b.addEventListener("click", () => { S.filter = b.dataset.f; viewRequests(v); }));
  $("#q").addEventListener("input", debounce((e) => { S.search = e.target.value.trim(); draw(); }, 200));
  $("#refresh").addEventListener("click", async (e) => { await busy(e.currentTarget, () => reload(["requests"])); renderShell(); });
  $("#exportCsv").addEventListener("click", exportCsv);
  draw();
}

function openRequest(id) {
  const r = S.requests.find((x) => x.id === id);
  if (!r) return;
  const manage = can(S.user, "requests.manage");
  const tel = digitsOnly(r.phone);
  const greet = `Bonjour ${r.name}, ici ${S.settings.brand} au sujet de votre demande ${r.id}.`;
  const pref = { anydesk: "AnyDesk", video: "Appel vidéo", any: "Peu importe", onsite: "Sur site" }[r.contactPref] || "—";
  const m = modal({
    title: `Demande ${r.id}`, size: "lg",
    body: `
      <div class="detail-grid">
        <dl class="dl"><dt>Client</dt><dd>${esc(r.name)}${r.company ? ` · ${esc(r.company)}` : ""}</dd></dl>
        <dl class="dl"><dt>Téléphone</dt><dd dir="ltr">${esc(r.phone)}</dd></dl>
        <dl class="dl"><dt>Ville</dt><dd>${esc(r.city)}</dd></dl>
        <dl class="dl"><dt>Reçue le</dt><dd>${esc(fmtDate(r.createdAt))}</dd></dl>
        <dl class="dl"><dt>Pack</dt><dd>${esc(r.packName || r.packId)} · ${esc(formatPrice(r.price))}</dd></dl>
        <dl class="dl"><dt>Préférence</dt><dd>${esc(pref)}</dd></dl>
        ${r.address ? `<dl class="dl"><dt>Adresse</dt><dd>${esc(r.address)}</dd></dl>` : ""}
        <dl class="dl"><dt>Type de problème</dt><dd>${esc(r.category)}</dd></dl>
      </div>
      <hr class="sep">
      <div class="problem-box">${esc(r.problem)}</div>
      <hr class="sep">
      <div class="contact-actions">
        ${tel ? `<a class="btn btn-wa btn-sm" href="https://wa.me/${esc(toIntl(r.phone))}?text=${encodeURIComponent(greet)}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp}WhatsApp</a>
        <a class="btn btn-outline btn-sm" href="tel:${esc(tel)}">${ICONS.phone}Appeler</a>` : ""}
      </div>
      <hr class="sep">
      <form id="reqForm" class="form-grid two">
        <div class="field"><label for="f_status">Statut</label>
          <select class="select" id="f_status" name="status" ${manage ? "" : "disabled"}>${STATUSES.map((s) => `<option value="${s.key}" ${s.key === r.status ? "selected" : ""}>${s.label}</option>`).join("")}</select></div>
        ${field("Technicien en charge", "assignedTo", r.assignedTo || "", { max: 80, attrs: manage ? "" : "disabled" })}
        <div class="span-2">${field("Note interne (invisible pour le client)", "note", r.note || "", { textarea: true, max: 2000, attrs: manage ? "" : "disabled" })}</div>
      </form>`,
    foot: `${isAdmin(S.user) ? `<button class="btn btn-danger left" data-del>${ICONS.trash}Supprimer</button>` : ""}
      <button class="btn btn-outline" data-x>Fermer</button>
      ${manage ? `<button class="btn btn-primary" data-save>Enregistrer</button>` : ""}`
  });
  $("[data-save]", m.el)?.addEventListener("click", (e) => busy(e.currentTarget, async () => {
    const f = formVals($("#reqForm", m.el));
    const patch = { status: f.status, assignedTo: clip(f.assignedTo, 80), note: clip(f.note, 2000) };
    await S.db.updateRequest(r.id, patch);
    Object.assign(r, patch, { updatedAt: Date.now() });
    m.close(); toast("Demande mise à jour."); renderShell();
  }));
  $("[data-del]", m.el)?.addEventListener("click", async () => {
    if (!(await confirmBox(`Supprimer définitivement la demande ${r.id} ?`, { ok: "Supprimer" }))) return;
    try { await S.db.deleteRequest(r.id); S.requests = S.requests.filter((x) => x.id !== r.id); m.close(); toast("Demande supprimée."); renderShell(); }
    catch (ex) { toast(ex.message, true); }
  });
}

function exportCsv() {
  // Les cellules commençant par = + - @ sont neutralisées (protection contre l'injection de formules Excel)
  const cell = (v) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const cols = ["id", "date", "status", "packName", "price", "name", "company", "phone", "city", "address", "category", "problem", "contactPref", "assignedTo", "note"];
  const rows = S.requests.map((r) => cols.map((c) => cell(c === "date" ? fmtDate(r.createdAt) : c === "status" ? statusLabel(r.status) : r[c])).join(";"));
  const blob = new Blob(["﻿" + [cols.join(";"), ...rows].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `demandes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ============================================================
//  PACKS
// ============================================================
function viewPacks(v) {
  v.innerHTML = `
    <div class="page-title"><div><h1>Packs et prix</h1><p>Ce que les clients voient dans la section Tarifs.</p></div>
      <div class="actions"><button class="btn btn-primary btn-sm" id="addPack">${ICONS.plus}Ajouter un pack</button></div></div>
    <div class="pack-admin">${S.packs.map((p) => `
      <div class="pa t-${p.mode === "onsite" ? "onsite" : p.highlight ? "urgent" : "standard"} ${p.active ? "" : "off"}">
        <div class="pa-top"><span class="pack-icon">${icon(p.icon)}</span>
          <span class="tag ${p.active ? "ok" : ""}">${p.active ? "Visible" : "Masqué"}</span></div>
        <h3>${esc(p.name_fr)}</h3>
        <div class="price">${esc(formatPrice(p.price))}</div>
        <p>${esc(p.delay_fr)} · ${p.mode === "onsite" ? "Sur site" : "À distance"}${p.highlight ? " · Mis en avant" : ""}</p>
        <div class="pa-actions"><button class="btn btn-outline btn-sm" data-edit="${esc(p.id)}">${ICONS.edit}Modifier</button></div>
      </div>`).join("") || `<div class="panel"><div class="empty">Aucun pack.</div></div>`}
    </div>
    <div class="notice mt">${ICONS.info}<span>Les demandes déjà reçues gardent le prix du moment où elles ont été envoyées.</span></div>`;
  $("#addPack").addEventListener("click", () => editPack(null));
  $$("[data-edit]", v).forEach((b) => b.addEventListener("click", () => editPack(S.packs.find((p) => p.id === b.dataset.edit))));
}

function editPack(p) {
  const isNew = !p;
  p = p || { active: true, highlight: false, mode: "remote", icon: "clock", price: 0, order: S.packs.length + 1 };
  const m = modal({
    title: isNew ? "Nouveau pack" : `Modifier : ${p.name_fr}`, size: "lg",
    body: `<form id="packForm" class="stack" novalidate>
      ${bi("Nom du pack", "name", p, { max: 60 })}
      <div class="form-grid two">
        ${field("Prix (DH)", "price", p.price, { type: "number", attrs: 'min="0" max="100000" step="1" required' })}
        <div class="field"><label for="f_mode">Type d'intervention</label><select class="select" id="f_mode" name="mode">
          <option value="remote" ${p.mode !== "onsite" ? "selected" : ""}>À distance (AnyDesk / appel vidéo)</option>
          <option value="onsite" ${p.mode === "onsite" ? "selected" : ""}>Sur site (adresse demandée au client)</option></select></div>
        <div class="field"><label>Icône</label>${iconSelect("icon", p.icon)}</div>
        ${field("Ordre d'affichage", "order", p.order ?? 1, { type: "number", attrs: 'min="0" max="99"' })}
      </div>
      ${bi("Délai (ex : Rappel sous 24 h)", "delay", p, { max: 80 })}
      ${bi("Description courte", "desc", p, { textarea: true, max: 300, rows: 2 })}
      ${bi("Ce qui est inclus (une ligne par point)", "features", p, { textarea: true, max: 800, rows: 5 })}
      ${bi("Badge (facultatif, ex : Prioritaire)", "badge", p, { max: 30 })}
      <div class="perm-list">
        <label class="check-row"><input type="checkbox" name="active" ${p.active ? "checked" : ""}>Visible sur le site</label>
        <label class="check-row"><input type="checkbox" name="highlight" ${p.highlight ? "checked" : ""}>Mettre en avant (bordure bleue)</label>
      </div>
    </form>`,
    foot: `${!isNew && isAdmin(S.user) ? `<button class="btn btn-danger left" data-del>${ICONS.trash}Supprimer</button>` : ""}
      <button class="btn btn-outline" data-x>Annuler</button><button class="btn btn-primary" data-save>Enregistrer</button>`
  });
  $("[data-save]", m.el).addEventListener("click", (e) => busy(e.currentTarget, async () => {
    const form = $("#packForm", m.el);
    const f = formVals(form);
    if (!f.name_fr) throw new Error("Le nom en français est obligatoire.");
    const price = Math.round(Number(f.price));
    if (!Number.isFinite(price) || price < 0 || price > 100000) throw new Error("Prix invalide.");
    let id = p.id;
    if (isNew) {
      const base = slugify(f.name_fr) || "pack";
      id = base; let i = 2;
      while (S.packs.some((x) => x.id === id)) id = `${base}-${i++}`;
    }
    const data = {
      id, price, mode: f.mode === "onsite" ? "onsite" : "remote", icon: f.icon, order: Math.max(0, Math.min(99, Number(f.order) || 0)),
      active: form.elements.active.checked, highlight: form.elements.highlight.checked
    };
    ["name", "delay", "desc", "features", "badge"].forEach((k) => ["fr", "ar"].forEach((l) => { data[`${k}_${l}`] = f[`${k}_${l}`] || ""; }));
    await S.db.savePack(data);
    await reload(["packs"]);
    m.close(); toast("Pack enregistré."); renderShell();
  }));
  $("[data-del]", m.el)?.addEventListener("click", async () => {
    if (!(await confirmBox(`Supprimer le pack « ${p.name_fr} » ? Astuce : vous pouvez aussi simplement le masquer.`, { ok: "Supprimer" }))) return;
    try { await S.db.deletePack(p.id); await reload(["packs"]); m.close(); toast("Pack supprimé."); renderShell(); }
    catch (ex) { toast(ex.message, true); }
  });
}

// ============================================================
//  CONTENU DU SITE
// ============================================================
const LISTS = {
  steps: { title: "Étapes « Comment ça marche »", item: "Étape", fields: [["title", "Titre", 80], ["text", "Texte", 300, true]], icon: true, max: 6 },
  services: { title: "Services (problèmes réglés)", item: "Service", fields: [["title", "Titre", 80], ["text", "Texte", 300, true]], icon: true, max: 12, hint: "Ces titres apparaissent aussi dans la liste « Type de problème » du formulaire." },
  why: { title: "Pourquoi nous", item: "Argument", fields: [["title", "Titre", 80], ["text", "Texte", 300, true]], icon: true, max: 6 },
  faq: { title: "Questions fréquentes", item: "Question", fields: [["q", "Question", 160], ["a", "Réponse", 1000, true]], icon: false, max: 15 }
};

function viewContent(v) {
  const c = S.content;
  const work = Object.fromEntries(Object.keys(LISTS).map((k) => [k, JSON.parse(JSON.stringify(c[k] || DEFAULT_CONTENT[k] || []))]));
  v.innerHTML = `
    <div class="page-title"><div><h1>Contenu du site</h1><p>Tous les textes de la page d'accueil, en français et en arabe.</p></div></div>
    <form id="contentForm" novalidate>
      <div class="panel"><div class="panel-head"><div><h2>Bandeau d'annonce</h2><p>Une ligne en haut du site (promo, fermeture exceptionnelle…).</p></div></div>
        <div class="panel-body stack">
          <label class="check-row"><input type="checkbox" name="announceOn" ${c.announceOn ? "checked" : ""}>Afficher le bandeau</label>
          ${bi("Texte du bandeau", "announce", c, { max: 160 })}
        </div></div>
      <div class="panel"><div class="panel-head"><div><h2>En-tête de la page d'accueil</h2></div></div>
        <div class="panel-body stack">
          ${bi("Petite ligne au-dessus du titre", "hero_kicker", c, { max: 100 })}
          ${bi("Grand titre", "hero_title", c, { max: 120 })}
          ${bi("Texte d'introduction", "hero_sub", c, { textarea: true, max: 400, rows: 3 })}
          ${bi("Points clés (une ligne par point)", "hero_points", c, { textarea: true, max: 300, rows: 3 })}
        </div></div>
      ${Object.entries(LISTS).map(([k, L]) => `
      <div class="panel"><div class="panel-head"><div><h2>${L.title}</h2>${L.hint ? `<p>${L.hint}</p>` : ""}</div>
        <button type="button" class="btn btn-outline btn-sm" data-add="${k}">${ICONS.plus}Ajouter</button></div>
        <div class="panel-body"><div class="list-ed" id="list-${k}"></div></div></div>`).join("")}
      <div class="save-bar"><span>Les changements sont visibles sur le site dès l'enregistrement.</span>
        <button type="submit" class="btn btn-primary">Enregistrer le contenu</button></div>
    </form>`;

  const drawList = (k) => {
    const L = LISTS[k];
    const box = $(`#list-${k}`, v);
    box.innerHTML = work[k].map((it, i) => `
      <div class="li-card" data-k="${k}" data-i="${i}">
        <div class="li-head"><strong>${L.item} ${i + 1}</strong>
          ${L.icon ? `<div class="li-icon">${iconSelect(`${k}.${i}.icon`, it.icon)}</div>` : ""}
          <button type="button" class="icon-btn" data-mv="-1" aria-label="Monter" ${i === 0 ? "disabled" : ""}>${ICONS.up}</button>
          <button type="button" class="icon-btn" data-mv="1" aria-label="Descendre" ${i === work[k].length - 1 ? "disabled" : ""}>${ICONS.down}</button>
          <button type="button" class="icon-btn" data-rm aria-label="Supprimer">${ICONS.trash}</button></div>
        ${L.fields.map(([f, label, max, ta]) => bi(label, `${k}.${i}.${f}`, Object.fromEntries(["fr", "ar"].map((l) => [`${k}.${i}.${f}_${l}`, it[`${f}_${l}`] || ""])), { max, textarea: ta, rows: 2 })).join("")}
      </div>`).join("") || `<p class="hint">Aucun élément. Cette section sera masquée sur le site.</p>`;
    $$(".li-card", box).forEach((card) => {
      const i = Number(card.dataset.i);
      $$("input, textarea, select", card).forEach((el) => el.addEventListener("input", () => {
        const [, , f] = el.name.split(".");
        work[k][i][f] = el.value;
      }));
      $("[data-rm]", card).addEventListener("click", () => { work[k].splice(i, 1); drawList(k); });
      $$("[data-mv]", card).forEach((b) => b.addEventListener("click", () => {
        const j = i + Number(b.dataset.mv);
        [work[k][i], work[k][j]] = [work[k][j], work[k][i]];
        drawList(k);
      }));
    });
  };
  Object.keys(LISTS).forEach(drawList);
  $$("[data-add]", v).forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.add;
    if (work[k].length >= LISTS[k].max) return toast(`Maximum ${LISTS[k].max} éléments.`, true);
    work[k].push(LISTS[k].icon ? { icon: "monitor" } : {});
    drawList(k);
    $(`#list-${k} .li-card:last-child input`, v)?.focus();
  }));

  $("#contentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    busy($("button[type=submit]", e.target), async () => {
      const form = e.target;
      const f = formVals(form);
      const data = { announceOn: form.elements.announceOn.checked };
      ["announce", "hero_kicker", "hero_title", "hero_sub", "hero_points"].forEach((k) => ["fr", "ar"].forEach((l) => { data[`${k}_${l}`] = f[`${k}_${l}`] || ""; }));
      Object.entries(LISTS).forEach(([k, L]) => {
        data[k] = work[k].map((it) => {
          const o = L.icon ? { icon: ICON_CHOICES.some(([n]) => n === it.icon) ? it.icon : "monitor" } : {};
          L.fields.forEach(([fl, , max]) => ["fr", "ar"].forEach((l) => { o[`${fl}_${l}`] = clip(it[`${fl}_${l}`] || "", max); }));
          return o;
        }).filter((o) => o[`${L.fields[0][0]}_fr`] || o[`${L.fields[0][0]}_ar`]);
      });
      await S.db.saveContent(data);
      S.content = { ...S.content, ...data };
      toast("Contenu enregistré.");
    });
  });
}

// ============================================================
//  COORDONNÉES / PARAMÈTRES (administrateur)
// ============================================================
function viewSettings(v) {
  const s = S.settings;
  v.innerHTML = `
    <div class="page-title"><div><h1>Coordonnées et informations</h1><p>Nom, contacts, horaires, paiement et réseaux sociaux.</p></div></div>
    <form id="setForm" novalidate>
      <div class="panel"><div class="panel-head"><h2>Entreprise</h2></div><div class="panel-body stack">
        ${field("Nom de l'entreprise", "brand", s.brand, { max: 40, attrs: "required" })}
        ${bi("Slogan", "tagline", s, { max: 80 })}
      </div></div>
      <div class="panel"><div class="panel-head"><div><h2>Contact</h2><p>Le numéro WhatsApp reçoit toutes les demandes des clients.</p></div></div><div class="panel-body stack">
        <div class="form-grid two">
          ${field("Numéro WhatsApp", "whatsapp", s.whatsapp, { max: 20, hint: "Format international sans + : 06 12 34 56 78 → 212612345678", attrs: 'inputmode="numeric" dir="ltr"' })}
          ${field("Téléphone affiché", "phone", s.phone, { max: 20, attrs: 'dir="ltr"' })}
          ${field("Email (facultatif)", "email", s.email, { type: "email", max: 120, attrs: 'dir="ltr"' })}
        </div>
        <div><a class="btn btn-wa btn-sm" id="testWa" href="#" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp}Tester le numéro WhatsApp</a></div>
        ${bi("Ville / région", "city", s, { max: 60 })}
        ${bi("Horaires", "hours", s, { max: 80 })}
        ${bi("Zone de déplacement (pack sur site)", "zone", s, { max: 200 })}
      </div></div>
      <div class="panel"><div class="panel-head"><h2>Intervention et paiement</h2></div><div class="panel-body stack">
        ${field("Lien de téléchargement AnyDesk", "anydeskUrl", s.anydeskUrl, { type: "url", max: 300, attrs: 'dir="ltr"', hint: "Lien https:// uniquement." })}
        ${bi("Modalités de paiement", "payment", s, { textarea: true, max: 300, rows: 2 })}
      </div></div>
      <div class="panel"><div class="panel-head"><h2>Réseaux sociaux</h2></div><div class="panel-body form-grid two">
        ${field("Facebook", "facebook", s.facebook, { type: "url", max: 300, attrs: 'dir="ltr" placeholder="https://facebook.com/…"' })}
        ${field("Instagram", "instagram", s.instagram, { type: "url", max: 300, attrs: 'dir="ltr" placeholder="https://instagram.com/…"' })}
        ${field("LinkedIn", "linkedin", s.linkedin, { type: "url", max: 300, attrs: 'dir="ltr" placeholder="https://linkedin.com/company/…"' })}
      </div></div>
      <div class="save-bar"><span>Visible sur le site dès l'enregistrement.</span><button type="submit" class="btn btn-primary">Enregistrer</button></div>
    </form>`;
  const form = $("#setForm");
  const testWa = $("#testWa");
  const upd = () => { testWa.href = `https://wa.me/${toIntl(form.elements.whatsapp.value)}?text=${encodeURIComponent("Test du numéro WhatsApp ✅")}`; };
  form.elements.whatsapp.addEventListener("input", upd); upd();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    busy($("button[type=submit]", form), async () => {
      const f = formVals(form);
      if (!f.brand) throw new Error("Le nom de l'entreprise est obligatoire.");
      const wa = toIntl(f.whatsapp);
      if (wa && (wa.length < 9 || wa.length > 15)) throw new Error("Numéro WhatsApp invalide.");
      for (const k of ["anydeskUrl", "facebook", "instagram", "linkedin"]) {
        if (f[k] && !safeUrl(f[k])) throw new Error(`Le lien « ${k} » doit commencer par https://`);
      }
      if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) throw new Error("Email invalide.");
      const data = { brand: clip(f.brand, 40), whatsapp: wa, phone: clip(f.phone, 20), email: clip(f.email, 120) };
      ["anydeskUrl", "facebook", "instagram", "linkedin"].forEach((k) => { data[k] = f[k] ? safeUrl(f[k]) : ""; });
      ["tagline", "city", "hours", "zone", "payment"].forEach((k) => ["fr", "ar"].forEach((l) => { data[`${k}_${l}`] = f[`${k}_${l}`] || ""; }));
      await S.db.saveSettings(data);
      S.settings = { ...S.settings, ...data };
      toast("Informations enregistrées.");
      renderShell();
    });
  });
}

// ============================================================
//  UTILISATEURS (administrateur)
// ============================================================
async function viewUsers(v) {
  v.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
  await reload(["users"]);
  if (S.view !== "users") return;
  v.innerHTML = `
    <div class="page-title"><div><h1>Utilisateurs</h1><p>Les personnes qui peuvent se connecter à l'administration.</p></div>
      <div class="actions"><button class="btn btn-primary btn-sm" id="addUser">${ICONS.plus}Ajouter un utilisateur</button></div></div>
    <div class="panel"><table class="utable">
      <thead><tr><th>Nom</th><th>Rôle</th><th>Statut</th><th></th></tr></thead>
      <tbody>${S.users.map((u) => `<tr>
        <td><strong>${esc(u.name || "—")}</strong><small>${esc(u.email)}</small></td>
        <td>${roleLabel(u.role)}${u.role !== "admin" ? `<small>${(u.permissions || []).length} accès</small>` : ""}</td>
        <td>${u.active ? `<span class="st st-done">Actif</span>` : `<span class="st st-cancelled">Désactivé</span>`}</td>
        <td><button class="btn btn-outline btn-sm" data-u="${esc(u.uid)}">${ICONS.edit}Modifier</button></td>
      </tr>`).join("")}</tbody></table></div>
    <div class="notice mt">${ICONS.info}<span>Un compte désactivé ne peut plus rien lire ni modifier, même s'il connaît encore son mot de passe.</span></div>`;
  $("#addUser").addEventListener("click", () => editUser(null));
  $$("[data-u]", v).forEach((b) => b.addEventListener("click", () => editUser(S.users.find((u) => u.uid === b.dataset.u))));
}

function editUser(u) {
  const isNew = !u;
  const self = u && u.uid === S.user.uid;
  u = u || { role: "tech", permissions: ["requests.view", "requests.manage"], active: true };
  const m = modal({
    title: isNew ? "Nouvel utilisateur" : `Modifier : ${u.name || u.email}`,
    body: `<form id="userForm" class="stack" novalidate>
      ${field("Nom", "name", u.name || "", { max: 80 })}
      ${isNew ? field("Email", "email", "", { type: "email", max: 120, attrs: 'autocomplete="off"' }) + field("Mot de passe provisoire", "password", "", { type: "password", max: 128, attrs: 'autocomplete="new-password"', hint: "12 caractères minimum avec majuscule, minuscule et chiffre. Communiquez-le en privé." })
        : `<div class="field"><span class="label">Email</span><span>${esc(u.email)}</span></div>`}
      <div class="field"><label for="f_role">Rôle</label><select class="select" id="f_role" name="role" ${self ? "disabled" : ""}>
        <option value="tech" ${u.role !== "admin" ? "selected" : ""}>Technicien (accès choisis ci-dessous)</option>
        <option value="admin" ${u.role === "admin" ? "selected" : ""}>Administrateur (accès complet)</option></select></div>
      <div class="perm-list" id="perms">${PERMISSIONS.map((p) => `
        <label class="check-row"><input type="checkbox" name="perm" value="${p.key}" ${(u.permissions || []).includes(p.key) ? "checked" : ""}>${esc(p.label)}</label>`).join("")}</div>
      <label class="check-row"><input type="checkbox" name="active" ${u.active ? "checked" : ""} ${self ? "disabled" : ""}>Compte actif</label>
    </form>`,
    foot: `${!isNew && !self ? `<button class="btn btn-danger left" data-del>${ICONS.trash}Supprimer</button>` : ""}
      ${!isNew ? `<button class="btn btn-outline" data-reset>Envoyer un email de réinitialisation</button>` : ""}
      <button class="btn btn-primary" data-save>Enregistrer</button>`
  });
  const form = $("#userForm", m.el);
  const syncPerms = () => { $("#perms", m.el).hidden = form.elements.role.value === "admin"; };
  form.elements.role.addEventListener("change", syncPerms); syncPerms();

  $("[data-save]", m.el).addEventListener("click", (e) => busy(e.currentTarget, async () => {
    const f = formVals(form);
    const role = self ? "admin" : (f.role === "admin" ? "admin" : "tech");
    const permissions = role === "admin" ? [] : $$("input[name=perm]:checked", form).map((x) => x.value).filter((k) => PERMISSIONS.some((p) => p.key === k));
    const active = self ? true : form.elements.active.checked;
    const name = clip(f.name, 80);
    if (isNew) {
      if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) throw new Error("Email invalide.");
      const pw = passwordProblem(f.password || "");
      if (pw) throw new Error(pw);
      await S.db.createUser({ name, email: f.email.toLowerCase(), password: f.password, role, permissions, active });
    } else {
      await S.db.updateUser(u.uid, { name, role, permissions, active });
    }
    m.close(); toast("Utilisateur enregistré."); viewUsers($("#view"));
  }));
  $("[data-reset]", m.el)?.addEventListener("click", async () => {
    try { await S.db.resetPassword(u.email); toast("Email de réinitialisation envoyé."); } catch (ex) { toast(ex.message, true); }
  });
  $("[data-del]", m.el)?.addEventListener("click", async () => {
    if (!(await confirmBox(`Supprimer l'accès de ${u.email} ? Il ne pourra plus se connecter à l'administration.`, { ok: "Supprimer" }))) return;
    try { await S.db.deleteUser(u.uid); m.close(); toast("Utilisateur supprimé."); viewUsers($("#view")); }
    catch (ex) { toast(ex.message, true); }
  });
}

// ============================================================
//  MON COMPTE
// ============================================================
function viewAccount(v) {
  const u = S.user;
  v.innerHTML = `
    <div class="page-title"><div><h1>Mon compte</h1><p>${esc(u.email)} · ${roleLabel(u.role)}</p></div></div>
    <div class="panel"><div class="panel-head"><div><h2>Changer mon mot de passe</h2><p>Utilisez un mot de passe unique, que vous n'utilisez nulle part ailleurs.</p></div></div>
      <div class="panel-body"><form id="pwForm" class="form-grid two" novalidate>
        <div class="span-2">${field("Mot de passe actuel", "current", "", { type: "password", max: 128, attrs: 'autocomplete="current-password"' })}</div>
        ${field("Nouveau mot de passe", "next", "", { type: "password", max: 128, attrs: 'autocomplete="new-password"', hint: "12 caractères minimum, avec majuscule, minuscule et chiffre." })}
        ${field("Confirmer", "confirm", "", { type: "password", max: 128, attrs: 'autocomplete="new-password"' })}
        <div class="span-2"><button class="btn btn-primary" type="submit">Mettre à jour</button></div>
      </form></div></div>
    <div class="panel"><div class="panel-head"><h2>Conseils de sécurité</h2></div><div class="panel-body">
      <ul class="checks">
        <li>${ICONS.check}<span>Ne partagez jamais votre mot de passe, même avec un collègue : créez-lui son propre compte.</span></li>
        <li>${ICONS.check}<span>Déconnectez-vous sur les ordinateurs partagés. La session se ferme aussi seule après ${CONFIG.adminIdleMinutes || 30} minutes d'inactivité ou à la fermeture du navigateur.</span></li>
        <li>${ICONS.check}<span>Si un membre de l'équipe part, désactivez son compte dans « Utilisateurs ».</span></li>
      </ul></div></div>`;
  const form = $("#pwForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    busy($("button[type=submit]", form), async () => {
      const f = formVals(form);
      const pw = passwordProblem(f.next);
      if (pw) throw new Error(pw);
      if (f.next !== f.confirm) throw new Error("Les deux mots de passe ne correspondent pas.");
      await S.db.changePassword(f.current, f.next);
      form.reset();
      toast("Mot de passe mis à jour.");
    });
  });
}

// ============================================================
//  DÉMARRAGE
// ============================================================
async function init() {
  try {
    S.db = await getDB();
    S.settings = await S.db.getSettings().catch(() => ({ brand: "Administration" }));
  } catch (e) {
    root.innerHTML = `<div class="auth-wrap"><div class="auth-card"><h1>Erreur</h1><p>${esc(e.message)}</p></div></div>`;
    return;
  }
  let armed = false;
  S.db.onAuth(async (user) => {
    S.user = user;
    if (!user) {
      clearTimeout(idleTimer);
      S.requests = []; S.users = [];
      const setup = await S.db.needsSetup().catch(() => false);
      return setup ? screenSetup() : screenLogin();
    }
    if (user.noProfile || user.active !== true) return screenDenied(user);
    root.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
    if (can(user, "packs.edit")) await S.db.seedPacks().catch(() => {});
    await reload();
    try { S.view = sessionStorage.getItem("adm_view") || "dashboard"; } catch {}
    if (!armed) { armIdle(); armed = true; }
    go(S.view);
  });
}

init();
