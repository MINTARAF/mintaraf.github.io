// ============================================================
//  ESPACE ADMINISTRATION (admin.html)
// ============================================================
import { getDB, can, PERMISSIONS, ORDER_STATUSES } from "./db.js";
import { ICONS, starLogo, heroStar } from "./icons.js";
import { esc, formatPrice, productImage, compressImage, debounce, digitsOnly } from "./utils.js";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "./seed.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const root = $("#root");

const S = { db: null, user: null, settings: {}, products: [], categories: [], orders: [], users: [], view: "dashboard" };

// ---------- Utilitaires UI ----------
function toast(msg, error = false) {
  const el = document.createElement("div");
  el.className = "toast" + (error ? " err" : "");
  el.innerHTML = `${error ? ICONS.info : ICONS.checkCircle}<span>${esc(msg)}</span>`;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 3400);
}

function modal({ title, body, foot = "", size = "" }) {
  const wrap = document.createElement("div");
  wrap.className = "modal-wrap";
  wrap.innerHTML = `
    <div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-x aria-label="Fermer">${ICONS.x}</button></div>
      <div class="modal-body">${body}</div>
      ${foot ? `<div class="modal-foot">${foot}</div>` : ""}
    </div>`;
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";
  const close = () => { wrap.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  wrap.addEventListener("mousedown", (e) => { if (e.target === wrap) close(); });
  $$("[data-x]", wrap).forEach((b) => b.addEventListener("click", close));
  setTimeout(() => ($("input, select, textarea", wrap) || $("[data-x]", wrap)).focus(), 30);
  return { el: wrap, close };
}

function confirmDialog(message, { okLabel = "Supprimer", danger = true } = {}) {
  return new Promise((resolve) => {
    const m = modal({
      title: "Confirmer", size: "sm",
      body: `<p style="color:var(--mist)">${esc(message)}</p>`,
      foot: `<button class="btn btn-ghost" data-x>Annuler</button><button class="btn ${danger ? "btn-primary" : "btn-primary"}" id="okBtn" style="${danger ? "background:var(--rose);color:#2a0609" : ""}">${esc(okLabel)}</button>`
    });
    const done = (v) => { m.close(); resolve(v); };
    $("#okBtn", m.el).onclick = () => done(true);
    $$("[data-x]", m.el).forEach((b) => b.addEventListener("click", () => resolve(false)));
  });
}

const switchHTML = (id, label, hint, checked, disabled = false) => `
  <label class="switch" for="${id}">
    <span class="sw-text"><strong>${esc(label)}</strong>${hint ? `<span>${esc(hint)}</span>` : ""}</span>
    <input type="checkbox" id="${id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}><span class="track"></span>
  </label>`;

const fmtDate = (ts) => ts ? new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const statusLabel = (k) => ORDER_STATUSES.find((s) => s.key === k)?.label || k;
const catName = (id) => S.categories.find((c) => c.id === id)?.name_fr || "Sans catégorie";
const cur = () => S.settings.currency || "DH";
const isAdmin = () => S.user?.role === "admin";
const initials = (n = "") => n.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase() || "?";
const toIntlPhone = (p = "") => { let d = digitsOnly(p); if (d.startsWith("00")) d = d.slice(2); if (d.startsWith("0")) d = "212" + d.slice(1); return d; };

// ============================================================
//  ÉCRANS D'AUTHENTIFICATION
// ============================================================
function authFrame(inner) {
  root.innerHTML = `
  <div class="auth-screen">
    <div class="auth-bg">${heroStar()}</div>
    <div class="auth-card">
      <div class="logo">${starLogo()}<span>${esc(S.settings.storeName || "Boutique")}</span></div>
      ${inner}
    </div>
  </div>`;
}

function screenLogin() {
  const demo = S.db.mode === "demo";
  authFrame(`
    <h1>Espace administration</h1>
    <p>Connectez-vous pour gérer la boutique.</p>
    <form id="loginForm" novalidate>
      <div id="loginMsg"></div>
      <div class="field"><label for="lgEmail">Email</label><input class="input" id="lgEmail" type="email" autocomplete="username" required dir="ltr"></div>
      <div class="field"><label for="lgPass">Mot de passe</label><input class="input" id="lgPass" type="password" autocomplete="current-password" required dir="ltr"></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit" id="lgBtn">Se connecter</button>
    </form>
    <div class="auth-alt">
      <a href="index.html">Retour à la boutique</a>
      ${demo ? "" : `<button id="forgotBtn" type="button">Mot de passe oublié ?</button>`}
    </div>
    ${demo ? `
    <div class="demo-box">
      <span><strong>Mode démo.</strong> Choisissez un compte pour tester :</span>
      <button type="button" data-demo="admin@demo.com|admin123"><strong>Administrateur</strong> · admin@demo.com / admin123</button>
      <button type="button" data-demo="staff@demo.com|staff123"><strong>Utilisateur</strong> · staff@demo.com / staff123</button>
    </div>` : ""}`);

  const msg = $("#loginMsg");
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#lgBtn");
    btn.disabled = true; btn.textContent = "Connexion…"; msg.innerHTML = "";
    try { await S.db.signIn($("#lgEmail").value, $("#lgPass").value); }
    catch (err) { msg.innerHTML = `<div class="form-error">${esc(err.message)}</div>`; btn.disabled = false; btn.textContent = "Se connecter"; }
  });
  $$("[data-demo]").forEach((b) => b.addEventListener("click", () => {
    const [em, pw] = b.dataset.demo.split("|");
    $("#lgEmail").value = em; $("#lgPass").value = pw;
    $("#loginForm").requestSubmit();
  }));
  $("#forgotBtn")?.addEventListener("click", async () => {
    const email = $("#lgEmail").value.trim();
    if (!email) { msg.innerHTML = `<div class="form-error">Saisissez d'abord votre email ci-dessus.</div>`; $("#lgEmail").focus(); return; }
    try { await S.db.resetPassword(email); msg.innerHTML = `<div class="form-ok">Un email de réinitialisation a été envoyé à ${esc(email)}.</div>`; }
    catch (err) { msg.innerHTML = `<div class="form-error">${esc(err.message)}</div>`; }
  });
}

function screenSetup() {
  authFrame(`
    <h1>Bienvenue</h1>
    <p>Première connexion : créez le compte administrateur principal. Il aura accès à tout.</p>
    <form id="setupForm" novalidate>
      <div id="setupMsg"></div>
      <div class="field"><label for="suName">Votre nom</label><input class="input" id="suName" required></div>
      <div class="field"><label for="suEmail">Email</label><input class="input" id="suEmail" type="email" required dir="ltr"></div>
      <div class="field"><label for="suPass">Mot de passe</label><input class="input" id="suPass" type="password" minlength="6" required dir="ltr"><span class="hint">6 caractères minimum.</span></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit" id="suBtn">Créer le compte administrateur</button>
    </form>`);
  $("#setupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#suName").value.trim(), email = $("#suEmail").value.trim(), password = $("#suPass").value;
    const msg = $("#setupMsg");
    if (!name || !email || password.length < 6) { msg.innerHTML = `<div class="form-error">Remplissez tous les champs (mot de passe : 6 caractères minimum).</div>`; return; }
    const btn = $("#suBtn"); btn.disabled = true; btn.textContent = "Création…";
    S.settingUp = true;
    try { await S.db.setupAdmin({ name, email, password }); location.reload(); }
    catch (err) { S.settingUp = false; msg.innerHTML = `<div class="form-error">${esc(err.message)}</div>`; btn.disabled = false; btn.textContent = "Créer le compte administrateur"; }
  });
}

function screenNoAccess() {
  authFrame(`
    <h1>Accès non autorisé</h1>
    <p>Le compte ${esc(S.user?.email || "")} n'a pas (ou plus) accès à l'administration. Demandez à l'administrateur de l'activer.</p>
    <button class="btn btn-ghost btn-block" id="outBtn">Se déconnecter</button>`);
  $("#outBtn").onclick = () => S.db.signOut();
}

// ============================================================
//  COQUILLE
// ============================================================
function navItems() {
  const u = S.user;
  const newOrders = S.orders.filter((o) => o.status === "new").length;
  return [
    { key: "dashboard", label: "Tableau de bord", icon: ICONS.grid, show: true },
    { key: "products", label: "Produits", icon: ICONS.box, show: can(u, "products.create") || can(u, "products.edit") || can(u, "products.delete") },
    { key: "categories", label: "Catégories", icon: ICONS.tag, show: can(u, "categories.manage") },
    { key: "orders", label: "Commandes", icon: ICONS.receipt, show: can(u, "orders.view"), count: newOrders },
    { key: "users", label: "Utilisateurs", icon: ICONS.users, show: isAdmin() },
    { key: "settings", label: "Paramètres", icon: ICONS.settings, show: isAdmin() }
  ].filter((i) => i.show);
}

const TITLES = { dashboard: "Tableau de bord", products: "Produits", categories: "Catégories", orders: "Commandes", users: "Utilisateurs", settings: "Paramètres" };

function renderShell() {
  const items = navItems();
  if (!items.some((i) => i.key === S.view)) S.view = "dashboard";
  const u = S.user;
  root.innerHTML = `
  ${S.db.mode === "demo" ? `<div class="demo-ribbon">Mode démo : les données restent dans ce navigateur. Connectez Firebase pour passer en production (voir README).</div>` : ""}
  <div class="shell">
    <aside class="sidebar" id="sidebar">
      <div class="sb-head"><a href="index.html" class="logo">${starLogo()}<span>${esc(S.settings.storeName)}</span></a></div>
      <nav class="sb-nav">
        ${items.map((i) => `<a href="#${i.key}" data-view="${i.key}" class="${S.view === i.key ? "active" : ""}">${i.icon}<span>${i.label}</span>${i.count ? `<span class="count">${i.count}</span>` : ""}</a>`).join("")}
        <div class="sb-sep"></div>
        <a href="index.html" target="_blank" rel="noopener">${ICONS.external}<span>Voir la boutique</span></a>
      </nav>
      <div class="sb-user">
        <span class="avatar">${esc(initials(u.name || u.email))}</span>
        <div class="who"><strong>${esc(u.name || u.email)}</strong><span>${isAdmin() ? "Administrateur" : "Utilisateur"}</span></div>
        <button class="icon-btn" id="logoutBtn" aria-label="Se déconnecter" title="Se déconnecter">${ICONS.logout}</button>
      </div>
    </aside>
    <div class="sb-scrim" id="sbScrim" hidden></div>
    <div class="main-col">
      <header class="topbar">
        <button class="icon-btn" id="menuBtn" aria-label="Menu">${ICONS.menu}</button>
        <h1 id="viewTitle">${TITLES[S.view]}</h1>
        <div class="tb-actions" id="tbActions"></div>
      </header>
      <main class="content" id="view"></main>
    </div>
  </div>`;

  $("#logoutBtn").onclick = () => S.db.signOut();
  const sb = $("#sidebar"), scrim = $("#sbScrim");
  const closeSb = () => { sb.classList.remove("open"); scrim.hidden = true; };
  $("#menuBtn").onclick = () => { sb.classList.add("open"); scrim.hidden = false; };
  scrim.onclick = closeSb;
  $$("[data-view]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); go(a.dataset.view); closeSb(); }));
  renderView();
}

function go(view) {
  S.view = view;
  history.replaceState(null, "", "#" + view);
  $$("[data-view]").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
  $("#viewTitle").textContent = TITLES[view];
  renderView();
}

function refreshNavCounts() {
  const n = S.orders.filter((o) => o.status === "new").length;
  const a = $('[data-view="orders"]');
  if (!a) return;
  const c = $(".count", a);
  if (n) { if (c) c.textContent = n; else a.insertAdjacentHTML("beforeend", `<span class="count">${n}</span>`); }
  else c?.remove();
}

function renderView() {
  $("#tbActions").innerHTML = "";
  // Nouveau conteneur à chaque vue : évite d'empiler les écouteurs d'événements
  const old = $("#view");
  const v = old.cloneNode(false);
  old.replaceWith(v);
  v.innerHTML = `<div class="loading">Chargement…</div>`;
  ({ dashboard: viewDashboard, products: viewProducts, categories: viewCategories, orders: viewOrders, users: viewUsers, settings: viewSettings }[S.view] || viewDashboard)(v);
}

async function loadData() {
  const u = S.user;
  const tasks = [S.db.getSettings(), S.db.listCategories(), S.db.listProducts({ all: true })];
  tasks.push(can(u, "orders.view") ? S.db.listOrders() : Promise.resolve([]));
  const [settings, categories, products, orders] = await Promise.all(tasks);
  Object.assign(S, { settings, categories, products, orders });
}

// ============================================================
//  TABLEAU DE BORD
// ============================================================
function viewDashboard(v) {
  const u = S.user;
  const seeOrders = can(u, "orders.view");
  const revenue = S.orders.filter((o) => ["confirmed", "delivered"].includes(o.status)).reduce((s, o) => s + Number(o.total || 0), 0);
  const published = S.products.filter((p) => p.published).length;
  const hour = new Date().getHours();
  const hello = hour < 18 ? "Bonjour" : "Bonsoir";

  v.innerHTML = `
    <p style="color:var(--mist);margin-bottom:1.4rem">${hello} ${esc((u.name || "").split(" ")[0])}, voici l'état de la boutique.</p>
    <div class="kpis">
      ${seeOrders ? `
      <div class="kpi accent"><span>Chiffre d'affaires confirmé</span><strong>${formatPrice(revenue, cur())}</strong></div>
      <div class="kpi"><span>Nouvelles commandes</span><strong>${S.orders.filter((o) => o.status === "new").length}</strong></div>
      <div class="kpi"><span>Total commandes</span><strong>${S.orders.length}</strong></div>` : ""}
      <div class="kpi"><span>Produits en ligne</span><strong>${published}<span style="display:inline;font-size:var(--fs-sm);color:var(--mist-2);font-weight:400"> / ${S.products.length}</span></strong></div>
    </div>

    ${S.products.length === 0 && can(u, "products.create") ? `
    <div class="card-panel" style="margin-bottom:1.4rem">
      <div class="empty">${ICONS.box}<div><strong>Votre boutique est vide</strong><p class="hint">Ajoutez votre premier produit, ou chargez des exemples pour voir le rendu.</p></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary" id="dAdd">${ICONS.plus.replace("<svg", '<svg width="18" height="18"')}Ajouter un produit</button>
          ${isAdmin() ? `<button class="btn btn-ghost" id="dSeed">Charger les exemples</button>` : ""}
        </div>
      </div>
    </div>` : ""}

    ${seeOrders ? `
    <div class="card-panel">
      <div class="cp-head"><h2>Dernières commandes</h2><a href="#orders" data-go="orders">Tout voir</a></div>
      ${S.orders.length ? `<div class="rows">${S.orders.slice(0, 6).map(orderRowHTML).join("")}</div>`
        : `<div class="empty">${ICONS.receipt}<p>Les commandes envoyées sur WhatsApp apparaîtront ici.</p></div>`}
    </div>` : `
    <div class="card-panel"><div class="empty">${ICONS.box}<p>Utilisez le menu pour accéder aux sections autorisées pour votre compte.</p></div></div>`}`;

  $("#dAdd")?.addEventListener("click", () => productForm());
  $("#dSeed")?.addEventListener("click", seedExamples);
  $$("[data-go]", v).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); go(a.dataset.go); }));
  bindOrderRows(v);
}

async function seedExamples() {
  try {
    for (const c of SEED_CATEGORIES) await S.db.saveCategory(c);
    for (const p of SEED_PRODUCTS) await S.db.saveProduct({ ...p, createdBy: S.user.uid });
    await loadData();
    toast("Exemples chargés");
    renderView();
  } catch (e) { toast(e.message, true); }
}

// ============================================================
//  PRODUITS
// ============================================================
function canEditProduct(p) {
  return can(S.user, "products.edit") || (can(S.user, "products.create") && p.createdBy === S.user.uid);
}

function viewProducts(v) {
  const u = S.user;
  if (can(u, "products.create")) {
    $("#tbActions").innerHTML = `<button class="btn btn-primary" id="addProd">${ICONS.plus.replace("<svg", '<svg width="18" height="18"')}<span>Ajouter</span></button>`;
    $("#addProd").onclick = () => productForm();
  }
  v.innerHTML = `
    <div class="toolbar">
      <input class="input" id="pSearch" type="search" placeholder="Rechercher un produit…">
      <select class="select" id="pCat" style="width:auto;min-height:44px">
        <option value="">Toutes les catégories</option>
        ${S.categories.map((c) => `<option value="${esc(c.id)}">${esc(c.name_fr)}</option>`).join("")}
      </select>
    </div>
    <div class="card-panel"><div class="rows" id="pList"></div></div>`;
  const draw = () => {
    const q = $("#pSearch").value.trim().toLowerCase(), cat = $("#pCat").value;
    const list = S.products.filter((p) => (!cat || p.category === cat) && (!q || `${p.title_fr} ${p.title_ar}`.toLowerCase().includes(q)));
    $("#pList").innerHTML = list.length ? list.map((p) => `
      <div class="row">
        <img src="${productImage(p)}" alt="">
        <div class="r-main">
          <div class="r-title">${esc(p.title_fr)}</div>
          <div class="r-meta">
            <span style="color:var(--brass-2);font-weight:500">${formatPrice(p.price, cur())}</span>
            <span>${esc(catName(p.category))}</span>
            <span class="pill ${p.published ? "on" : "off"}">${p.published ? "En ligne" : "Brouillon"}</span>
            ${p.featured ? `<span class="pill new">Mis en avant</span>` : ""}
          </div>
        </div>
        <div class="r-actions">
          <a class="icon-btn" href="index.html#/p/${encodeURIComponent(p.id)}" target="_blank" rel="noopener" aria-label="Voir" title="Voir sur la boutique">${ICONS.eye}</a>
          ${canEditProduct(p) ? `<button class="icon-btn" data-edit="${esc(p.id)}" aria-label="Modifier" title="Modifier">${ICONS.edit}</button>` : ""}
          ${can(u, "products.delete") ? `<button class="icon-btn danger" data-del="${esc(p.id)}" aria-label="Supprimer" title="Supprimer">${ICONS.trash}</button>` : ""}
        </div>
      </div>`).join("")
      : `<div class="empty">${ICONS.box}<p>${S.products.length ? "Aucun produit ne correspond à ces filtres." : "Aucun produit pour l'instant."}</p>
          ${!S.products.length && can(u, "products.create") ? `<button class="btn btn-primary" id="emptyAdd">Ajouter un produit</button>` : ""}</div>`;
    $("#emptyAdd")?.addEventListener("click", () => productForm());
  };
  $("#pSearch").addEventListener("input", debounce(draw, 150));
  $("#pCat").addEventListener("change", draw);
  $("#pList").addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]");
    if (ed) return productForm(S.products.find((p) => p.id === ed.dataset.edit));
    const del = e.target.closest("[data-del]");
    if (del) {
      const p = S.products.find((x) => x.id === del.dataset.del);
      if (!(await confirmDialog(`Supprimer « ${p.title_fr} » ? Cette action est définitive.`))) return;
      try { await S.db.deleteProduct(p.id); S.products = S.products.filter((x) => x.id !== p.id); toast("Produit supprimé"); draw(); }
      catch (err) { toast(err.message, true); }
    }
  });
  draw();
}

function productForm(p = null) {
  const isNew = !p;
  p = p || { published: true, featured: false, price: "", oldPrice: "", category: S.categories[0]?.id || "", image: "" };
  let image = p.image || "";
  const f = (k) => esc(p[k] ?? "");
  const m = modal({
    title: isNew ? "Nouveau produit" : "Modifier le produit",
    body: `
      <form id="pForm" class="settings-grid" novalidate>
        <div id="pMsg"></div>
        <div class="img-pick">
          <img class="preview" id="pPrev" src="${productImage(p)}" alt="">
          <div class="ip-actions">
            <div class="ip-row">
              <label class="btn btn-ghost" style="cursor:pointer">${ICONS.upload.replace("<svg", '<svg width="16" height="16"')}Choisir une image<input type="file" accept="image/*" id="pFile" hidden></label>
              <button type="button" class="btn btn-ghost" id="pImgClear">Retirer</button>
            </div>
            <input class="input" id="pImgUrl" placeholder="…ou collez un lien d'image (https://)" value="${image.startsWith("data:") ? "" : esc(image)}" dir="ltr">
            <span class="hint">Format carré conseillé. L'image est compressée automatiquement.</span>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
          <span class="section-label" style="margin:0">Textes</span>
          <div class="seg" role="tablist"><button type="button" class="active" data-lang="fr">Français</button><button type="button" data-lang="ar">العربية</button></div>
        </div>
        <div data-pane="fr" class="settings-grid">
          <div class="field"><label for="tFr">Nom du produit *</label><input class="input" id="tFr" value="${f("title_fr")}" required></div>
          <div class="field"><label for="sFr">Accroche courte</label><input class="input" id="sFr" value="${f("short_fr")}" placeholder="Une phrase qui résume le produit"></div>
          <div class="field"><label for="fFr">Ce que le client reçoit</label><textarea class="textarea" id="fFr" rows="4" placeholder="Un élément par ligne">${f("features_fr")}</textarea></div>
          <div class="field"><label for="dFr">Description</label><textarea class="textarea" id="dFr" rows="5">${f("description_fr")}</textarea></div>
          <div class="field"><label for="bFr">Badge (facultatif)</label><input class="input" id="bFr" value="${f("badge_fr")}" placeholder="Ex : Nouveau, Best-seller"></div>
        </div>
        <div data-pane="ar" class="settings-grid" hidden dir="rtl">
          <div class="field"><label for="tAr">اسم المنتج</label><input class="input" id="tAr" value="${f("title_ar")}"></div>
          <div class="field"><label for="sAr">وصف قصير</label><input class="input" id="sAr" value="${f("short_ar")}"></div>
          <div class="field"><label for="fAr">شنو غادي يوصل الزبون</label><textarea class="textarea" id="fAr" rows="4" placeholder="عنصر فكل سطر">${f("features_ar")}</textarea></div>
          <div class="field"><label for="dAr">الوصف</label><textarea class="textarea" id="dAr" rows="5">${f("description_ar")}</textarea></div>
          <div class="field"><label for="bAr">شارة (اختياري)</label><input class="input" id="bAr" value="${f("badge_ar")}" placeholder="مثلاً: جديد"></div>
          <span class="hint">Si un champ arabe est vide, le texte français est affiché à la place.</span>
        </div>

        <span class="section-label">Prix et classement</span>
        <div class="two">
          <div class="field"><label for="pPrice">Prix (${esc(cur())}) *</label><input class="input" id="pPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${f("price")}" required></div>
          <div class="field"><label for="pOld">Ancien prix (barré)</label><input class="input" id="pOld" type="number" min="0" step="0.01" inputmode="decimal" value="${p.oldPrice ? f("oldPrice") : ""}" placeholder="Facultatif"></div>
        </div>
        <div class="field"><label for="pCatSel">Catégorie</label>
          <select class="select" id="pCatSel"><option value="">Sans catégorie</option>${S.categories.map((c) => `<option value="${esc(c.id)}" ${p.category === c.id ? "selected" : ""}>${esc(c.icon || "")} ${esc(c.name_fr)}</option>`).join("")}</select></div>
        <div class="fieldset">
          ${switchHTML("pPub", "En ligne", "Visible par les clients sur la boutique", p.published !== false)}
          ${switchHTML("pFeat", "Mettre en avant", "Affiché dans « Les plus demandés » sur l'accueil", !!p.featured)}
        </div>
      </form>`,
    foot: `<button class="btn btn-ghost" data-x>Annuler</button><button class="btn btn-primary" id="pSave">${isNew ? "Ajouter le produit" : "Enregistrer"}</button>`
  });
  const el = m.el;
  $$(".seg button", el).forEach((b) => b.addEventListener("click", () => {
    $$(".seg button", el).forEach((x) => x.classList.toggle("active", x === b));
    $$("[data-pane]", el).forEach((pane) => (pane.hidden = pane.dataset.pane !== b.dataset.lang));
  }));
  const setPreview = () => { $("#pPrev", el).src = image || productImage({ ...p, image: "" }); };
  $("#pFile", el).addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { image = await compressImage(file); $("#pImgUrl", el).value = ""; setPreview(); }
    catch (err) { toast(err.message, true); }
  });
  $("#pImgUrl", el).addEventListener("input", (e) => { image = e.target.value.trim(); setPreview(); });
  $("#pImgClear", el).addEventListener("click", () => { image = ""; $("#pImgUrl", el).value = ""; setPreview(); });

  $("#pSave", el).addEventListener("click", async () => {
    const title = $("#tFr", el).value.trim();
    const price = parseFloat($("#pPrice", el).value);
    const msg = $("#pMsg", el);
    if (!title) { msg.innerHTML = `<div class="form-error">Le nom du produit (français) est obligatoire.</div>`; $$(".seg button", el)[0].click(); $("#tFr", el).focus(); return; }
    if (isNaN(price) || price < 0) { msg.innerHTML = `<div class="form-error">Indiquez un prix valide.</div>`; $("#pPrice", el).focus(); return; }
    const oldPrice = parseFloat($("#pOld", el).value) || 0;
    const data = {
      ...(isNew ? { createdBy: S.user.uid } : { id: p.id }),
      title_fr: title, title_ar: $("#tAr", el).value.trim(),
      short_fr: $("#sFr", el).value.trim(), short_ar: $("#sAr", el).value.trim(),
      features_fr: $("#fFr", el).value.trim(), features_ar: $("#fAr", el).value.trim(),
      description_fr: $("#dFr", el).value.trim(), description_ar: $("#dAr", el).value.trim(),
      badge_fr: $("#bFr", el).value.trim(), badge_ar: $("#bAr", el).value.trim(),
      price, oldPrice: oldPrice > price ? oldPrice : 0,
      category: $("#pCatSel", el).value, image,
      published: $("#pPub", el).checked, featured: $("#pFeat", el).checked
    };
    const btn = $("#pSave", el); btn.disabled = true; btn.textContent = "Enregistrement…";
    try {
      const id = await S.db.saveProduct(data);
      const saved = { ...p, ...data, id };
      const i = S.products.findIndex((x) => x.id === id);
      if (i >= 0) S.products[i] = saved; else S.products.unshift(saved);
      m.close();
      toast(isNew ? "Produit ajouté" : "Produit enregistré");
      renderView();
    } catch (err) {
      msg.innerHTML = `<div class="form-error">${esc(err.message)}</div>`;
      btn.disabled = false; btn.textContent = isNew ? "Ajouter le produit" : "Enregistrer";
    }
  });
}

// ============================================================
//  CATÉGORIES
// ============================================================
function viewCategories(v) {
  $("#tbActions").innerHTML = `<button class="btn btn-primary" id="addCat">${ICONS.plus.replace("<svg", '<svg width="18" height="18"')}<span>Ajouter</span></button>`;
  $("#addCat").onclick = () => categoryForm();
  v.innerHTML = `<div class="card-panel"><div class="rows">
    ${S.categories.length ? S.categories.map((c) => {
      const n = S.products.filter((p) => p.category === c.id).length;
      return `<div class="row no-img">
        <div class="r-main" style="display:flex;align-items:center;gap:.9rem">
          <span style="font-size:1.5rem;width:44px;height:44px;display:grid;place-items:center;border-radius:var(--r-md);background:var(--ink-3)">${esc(c.icon || "✦")}</span>
          <div style="min-width:0"><div class="r-title">${esc(c.name_fr)} <span style="color:var(--mist-2);font-weight:300">· <span dir="rtl">${esc(c.name_ar || "")}</span></span></div>
          <div class="r-meta"><span>${n} produit${n > 1 ? "s" : ""}</span><span>Ordre : ${c.order ?? "—"}</span></div></div>
        </div>
        <div class="r-actions">
          <button class="icon-btn" data-edit="${esc(c.id)}" aria-label="Modifier">${ICONS.edit}</button>
          <button class="icon-btn danger" data-del="${esc(c.id)}" aria-label="Supprimer">${ICONS.trash}</button>
        </div>
      </div>`;
    }).join("") : `<div class="empty">${ICONS.tag}<p>Créez des catégories pour organiser vos produits.</p></div>`}
  </div></div>`;
  v.querySelector(".rows").addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]");
    if (ed) return categoryForm(S.categories.find((c) => c.id === ed.dataset.edit));
    const del = e.target.closest("[data-del]");
    if (del) {
      const c = S.categories.find((x) => x.id === del.dataset.del);
      if (!(await confirmDialog(`Supprimer la catégorie « ${c.name_fr} » ? Les produits resteront, sans catégorie.`))) return;
      try { await S.db.deleteCategory(c.id); S.categories = S.categories.filter((x) => x.id !== c.id); toast("Catégorie supprimée"); renderView(); }
      catch (err) { toast(err.message, true); }
    }
  });
}

function categoryForm(c = null) {
  const isNew = !c;
  c = c || { icon: "✦", order: S.categories.length + 1 };
  const m = modal({
    title: isNew ? "Nouvelle catégorie" : "Modifier la catégorie", size: "sm",
    body: `<div id="cMsg"></div>
      <div class="field"><label for="cFr">Nom (français) *</label><input class="input" id="cFr" value="${esc(c.name_fr || "")}"></div>
      <div class="field"><label for="cAr">الاسم (العربية)</label><input class="input" id="cAr" value="${esc(c.name_ar || "")}" dir="rtl"></div>
      <div class="two">
        <div class="field"><label for="cIcon">Icône (emoji)</label><input class="input" id="cIcon" value="${esc(c.icon || "")}" maxlength="4"></div>
        <div class="field"><label for="cOrder">Ordre d'affichage</label><input class="input" id="cOrder" type="number" value="${esc(c.order ?? "")}"></div>
      </div>`,
    foot: `<button class="btn btn-ghost" data-x>Annuler</button><button class="btn btn-primary" id="cSave">${isNew ? "Ajouter" : "Enregistrer"}</button>`
  });
  $("#cSave", m.el).onclick = async () => {
    const name = $("#cFr", m.el).value.trim();
    if (!name) { $("#cMsg", m.el).innerHTML = `<div class="form-error">Le nom est obligatoire.</div>`; return; }
    const data = { ...(isNew ? {} : { id: c.id }), name_fr: name, name_ar: $("#cAr", m.el).value.trim(), icon: $("#cIcon", m.el).value.trim(), order: parseInt($("#cOrder", m.el).value) || 99 };
    try {
      const id = await S.db.saveCategory(data);
      const saved = { ...c, ...data, id };
      const i = S.categories.findIndex((x) => x.id === id);
      if (i >= 0) S.categories[i] = saved; else S.categories.push(saved);
      S.categories.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      m.close(); toast(isNew ? "Catégorie ajoutée" : "Catégorie enregistrée"); renderView();
    } catch (err) { $("#cMsg", m.el).innerHTML = `<div class="form-error">${esc(err.message)}</div>`; }
  };
}

// ============================================================
//  COMMANDES
// ============================================================
function orderRowHTML(o) {
  const manage = can(S.user, "orders.manage");
  return `
  <div class="row order-row">
    <div class="r-main">
      <div class="r-title">${esc(o.customer?.name || "—")} <span style="color:var(--mist-2);font-weight:300">· ${esc(o.id)}</span></div>
      <div class="r-meta">
        <span style="color:var(--brass-2);font-weight:500">${formatPrice(o.total, o.currency || cur())}</span>
        <span>${o.items?.length || 0} article${(o.items?.length || 0) > 1 ? "s" : ""}</span>
        <span>${fmtDate(o.createdAt)}</span>
        ${manage ? "" : `<span class="pill ${o.status}">${statusLabel(o.status)}</span>`}
      </div>
    </div>
    <div class="r-actions">
      ${manage ? `<select class="select status-select" data-status="${esc(o.id)}" aria-label="Statut">${ORDER_STATUSES.map((s) => `<option value="${s.key}" ${o.status === s.key ? "selected" : ""}>${s.label}</option>`).join("")}</select>` : ""}
      <button class="icon-btn" data-view-order="${esc(o.id)}" aria-label="Détails" title="Détails">${ICONS.eye}</button>
    </div>
  </div>`;
}

function bindOrderRows(scope) {
  scope.addEventListener("change", async (e) => {
    const sel = e.target.closest("[data-status]");
    if (!sel) return;
    try {
      await S.db.updateOrder(sel.dataset.status, { status: sel.value, updatedAt: Date.now() });
      const o = S.orders.find((x) => x.id === sel.dataset.status); if (o) o.status = sel.value;
      toast(`Commande ${sel.dataset.status} : ${statusLabel(sel.value).toLowerCase()}`);
      refreshNavCounts();
    } catch (err) { toast(err.message, true); }
  });
  scope.addEventListener("click", (e) => {
    const b = e.target.closest("[data-view-order]");
    if (b) orderDetails(S.orders.find((o) => o.id === b.dataset.viewOrder));
  });
}

function viewOrders(v) {
  let filter = "all";
  v.innerHTML = `
    <div class="toolbar">
      <div class="filters" id="oFilters"></div>
      <span class="spacer"></span>
      <input class="input" id="oSearch" type="search" placeholder="Nom, téléphone ou n° de commande">
    </div>
    <div class="card-panel"><div class="rows" id="oList"></div></div>`;
  const draw = () => {
    const q = $("#oSearch").value.trim().toLowerCase();
    const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s.key, S.orders.filter((o) => o.status === s.key).length]));
    $("#oFilters").innerHTML = [{ key: "all", label: "Toutes" }, ...ORDER_STATUSES].map((s) =>
      `<button class="chip ${filter === s.key ? "active" : ""}" data-f="${s.key}">${s.label}${s.key !== "all" && counts[s.key] ? ` (${counts[s.key]})` : ""}</button>`).join("");
    const list = S.orders.filter((o) => (filter === "all" || o.status === filter) &&
      (!q || `${o.id} ${o.customer?.name} ${o.customer?.phone}`.toLowerCase().includes(q)));
    $("#oList").innerHTML = list.length ? list.map(orderRowHTML).join("") : `<div class="empty">${ICONS.receipt}<p>${S.orders.length ? "Aucune commande dans cette vue." : "Aucune commande pour l'instant. Elles apparaîtront ici dès qu'un client passera commande."}</p></div>`;
  };
  $("#oFilters").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { filter = b.dataset.f; draw(); } });
  $("#oSearch").addEventListener("input", debounce(draw, 150));
  bindOrderRows($("#oList"));
  draw();
}

function orderDetails(o) {
  if (!o) return;
  const c = o.customer || {};
  const waClient = `https://wa.me/${toIntlPhone(c.phone)}?text=${encodeURIComponent(`Bonjour ${c.name}, merci pour votre commande ${o.id} chez ${S.settings.storeName}.`)}`;
  const m = modal({
    title: `Commande ${o.id}`,
    body: `
      <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap"><span class="pill ${o.status}">${statusLabel(o.status)}</span><span class="hint">${fmtDate(o.createdAt)}</span></div>
      <dl class="kv">
        <dt>Client</dt><dd>${esc(c.name)}</dd>
        <dt>Téléphone</dt><dd dir="ltr" style="text-align:start">${esc(c.phone)}</dd>
        ${c.email ? `<dt>Email</dt><dd>${esc(c.email)}</dd>` : ""}
        ${c.note ? `<dt>Remarque</dt><dd>${esc(c.note)}</dd>` : ""}
        <dt>Langue</dt><dd>${o.lang === "ar" ? "Arabe" : "Français"}</dd>
      </dl>
      <div class="order-items">
        ${(o.items || []).map((i) => `<div class="oi"><span>${esc(i.title)} × ${i.qty}</span><span>${formatPrice(i.price * i.qty, o.currency || cur())}</span></div>`).join("")}
        <div class="oi" style="border:0;font-weight:600;font-size:var(--fs-md)"><span>Total</span><span style="color:var(--brass-2)">${formatPrice(o.total, o.currency || cur())}</span></div>
      </div>`,
    foot: `
      ${isAdmin() ? `<button class="btn btn-ghost" id="oDel" style="margin-inline-end:auto;color:var(--rose)">Supprimer</button>` : ""}
      ${c.email ? `<a class="btn btn-ghost" href="mailto:${esc(c.email)}?subject=${encodeURIComponent("Votre commande " + o.id)}">Envoyer un email</a>` : ""}
      <a class="btn btn-wa" href="${esc(waClient)}" target="_blank" rel="noopener">${ICONS.whatsapp.replace("<svg", '<svg width="18" height="18"')}Écrire au client</a>`
  });
  $("#oDel", m.el)?.addEventListener("click", async () => {
    m.close();
    if (!(await confirmDialog(`Supprimer définitivement la commande ${o.id} ?`))) return;
    try { await S.db.deleteOrder(o.id); S.orders = S.orders.filter((x) => x.id !== o.id); toast("Commande supprimée"); refreshNavCounts(); renderView(); }
    catch (err) { toast(err.message, true); }
  });
}

// ============================================================
//  UTILISATEURS (administrateur uniquement)
// ============================================================
async function viewUsers(v) {
  $("#tbActions").innerHTML = `<button class="btn btn-primary" id="addUser">${ICONS.plus.replace("<svg", '<svg width="18" height="18"')}<span>Ajouter</span></button>`;
  $("#addUser").onclick = () => userForm();
  try { S.users = await S.db.listUsers(); }
  catch (e) { v.innerHTML = `<div class="form-error">${esc(e.message)}</div>`; return; }
  v.innerHTML = `
    <div class="notice" style="margin-bottom:1.2rem">${ICONS.info}<span>Un <strong style="color:var(--sand);font-weight:500">administrateur</strong> a accès à tout. Un <strong style="color:var(--sand);font-weight:500">utilisateur</strong> n'a que les accès que vous cochez (par exemple : ajouter des produits).</span></div>
    <div class="card-panel"><div class="rows" id="uList">
      ${S.users.map((u) => `
        <div class="row no-img">
          <div class="r-main" style="display:flex;align-items:center;gap:.9rem">
            <span class="avatar">${esc(initials(u.name || u.email))}</span>
            <div style="min-width:0">
              <div class="r-title">${esc(u.name || "—")}${u.uid === S.user.uid ? ` <span style="color:var(--mist-2);font-weight:300">(vous)</span>` : ""}</div>
              <div class="r-meta">
                <span>${esc(u.email)}</span>
                <span class="pill ${u.role === "admin" ? "admin" : "staff"}">${u.role === "admin" ? "Administrateur" : "Utilisateur"}</span>
                ${u.active === false ? `<span class="pill off">Désactivé</span>` : ""}
                ${u.role !== "admin" ? `<span>${(u.permissions || []).length} accès</span>` : ""}
              </div>
            </div>
          </div>
          <div class="r-actions">
            <button class="icon-btn" data-edit="${esc(u.uid)}" aria-label="Modifier">${ICONS.edit}</button>
            ${u.uid !== S.user.uid ? `<button class="icon-btn danger" data-del="${esc(u.uid)}" aria-label="Supprimer">${ICONS.trash}</button>` : ""}
          </div>
        </div>`).join("")}
    </div></div>`;
  $("#uList").addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]");
    if (ed) return userForm(S.users.find((u) => u.uid === ed.dataset.edit));
    const del = e.target.closest("[data-del]");
    if (del) {
      const u = S.users.find((x) => x.uid === del.dataset.del);
      const extra = S.db.mode === "firebase" ? " Son accès à l'admin sera retiré immédiatement." : "";
      if (!(await confirmDialog(`Supprimer le compte de ${u.name || u.email} ?${extra}`))) return;
      try { await S.db.deleteUser(u.uid); toast("Utilisateur supprimé"); renderView(); }
      catch (err) { toast(err.message, true); }
    }
  });
}

function userForm(u = null) {
  const isNew = !u;
  const self = u && u.uid === S.user.uid;
  u = u || { role: "staff", permissions: ["products.create"], active: true };
  const fb = S.db.mode === "firebase";
  const m = modal({
    title: isNew ? "Nouvel utilisateur" : "Modifier l'utilisateur",
    body: `<div id="uMsg"></div>
      <div class="two">
        <div class="field"><label for="uName">Nom *</label><input class="input" id="uName" value="${esc(u.name || "")}"></div>
        <div class="field"><label for="uEmail">Email *</label><input class="input" id="uEmail" type="email" value="${esc(u.email || "")}" ${isNew ? "" : "readonly"} dir="ltr"></div>
      </div>
      ${isNew || !fb ? `
      <div class="field"><label for="uPass">${isNew ? "Mot de passe *" : "Nouveau mot de passe"}</label>
        <input class="input" id="uPass" type="text" autocomplete="new-password" dir="ltr" placeholder="${isNew ? "6 caractères minimum" : "Laisser vide pour ne pas changer"}">
        ${isNew ? `<span class="hint">Communiquez-le à la personne ; elle pourra le changer avec « Mot de passe oublié ».</span>` : ""}</div>` : `
      <div class="notice">${ICONS.lock}<span>Pour changer le mot de passe, envoyez un email de réinitialisation. <button type="button" class="btn btn-ghost" id="uReset" style="min-height:34px;margin-top:.5rem">Envoyer l'email</button></span></div>`}
      <div class="field"><label for="uRole">Type de compte</label>
        <select class="select" id="uRole" ${self ? "disabled" : ""}>
          <option value="staff" ${u.role !== "admin" ? "selected" : ""}>Utilisateur (accès limités)</option>
          <option value="admin" ${u.role === "admin" ? "selected" : ""}>Administrateur (accès total)</option>
        </select></div>
      <fieldset class="fieldset" id="uPerms">
        <legend>Accès autorisés</legend>
        <div class="perm-grid">
          ${PERMISSIONS.map((p) => `<label class="perm-item"><input type="checkbox" value="${p.key}" ${(u.permissions || []).includes(p.key) ? "checked" : ""}><span>${esc(p.label)}</span></label>`).join("")}
        </div>
        <span class="hint" id="permHint"></span>
      </fieldset>
      <div class="fieldset">${switchHTML("uActive", "Compte actif", "Désactivez pour bloquer l'accès sans supprimer le compte", u.active !== false, self)}</div>`,
    foot: `<button class="btn btn-ghost" data-x>Annuler</button><button class="btn btn-primary" id="uSave">${isNew ? "Créer le compte" : "Enregistrer"}</button>`
  });
  const el = m.el;
  const syncRole = () => {
    const admin = $("#uRole", el).value === "admin";
    $$("#uPerms input", el).forEach((i) => { i.disabled = admin; i.closest(".perm-item").classList.toggle("disabled", admin); if (admin) i.checked = true; });
    $("#permHint", el).textContent = admin ? "Un administrateur a automatiquement tous les accès, y compris les utilisateurs et les paramètres." : "Les utilisateurs n'accèdent jamais aux paramètres ni à la gestion des comptes.";
  };
  $("#uRole", el).addEventListener("change", syncRole);
  syncRole();
  $("#uReset", el)?.addEventListener("click", async () => {
    try { await S.db.resetPassword(u.email); toast(`Email envoyé à ${u.email}`); } catch (err) { toast(err.message, true); }
  });
  $("#uSave", el).addEventListener("click", async () => {
    const msg = $("#uMsg", el);
    const name = $("#uName", el).value.trim(), email = $("#uEmail", el).value.trim();
    const role = $("#uRole", el).value;
    const permissions = role === "admin" ? [] : $$("#uPerms input:checked", el).map((i) => i.value);
    const active = $("#uActive", el).checked;
    const password = $("#uPass", el)?.value || "";
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) { msg.innerHTML = `<div class="form-error">Indiquez un nom et un email valide.</div>`; return; }
    if (isNew && password.length < 6) { msg.innerHTML = `<div class="form-error">Le mot de passe doit contenir au moins 6 caractères.</div>`; return; }
    const btn = $("#uSave", el); btn.disabled = true; btn.textContent = "Enregistrement…";
    try {
      if (isNew) await S.db.createUser({ name, email, password, role, permissions, active });
      else await S.db.updateUser(u.uid, { name, role: self ? u.role : role, permissions, active: self ? true : active, ...(fb ? {} : { password }) });
      m.close(); toast(isNew ? "Compte créé" : "Utilisateur enregistré");
      if (self) { S.user = { ...S.user, name }; renderShell(); } else renderView();
    } catch (err) {
      msg.innerHTML = `<div class="form-error">${esc(err.message)}</div>`;
      btn.disabled = false; btn.textContent = isNew ? "Créer le compte" : "Enregistrer";
    }
  });
}

// ============================================================
//  PARAMÈTRES (administrateur uniquement)
// ============================================================
function viewSettings(v) {
  const s = S.settings;
  const inp = (id, label, val, extra = "") => `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" value="${esc(val || "")}" ${extra}></div>`;
  const area = (id, label, val, extra = "") => `<div class="field"><label for="${id}">${label}</label><textarea class="textarea" id="${id}" rows="3" ${extra}>${esc(val || "")}</textarea></div>`;
  v.innerHTML = `
    <form id="sForm" class="settings-grid" style="max-width:820px">
      <div class="card-panel" style="padding:1.3rem;display:grid;gap:1rem">
        <span class="section-label" style="margin:0">Boutique</span>
        <div class="two">${inp("sName", "Nom de la boutique", s.storeName)}${inp("sCur", "Devise affichée", s.currency, 'placeholder="DH"')}</div>
        <div class="two">
          <div class="field"><label for="sWa">Numéro WhatsApp des commandes</label><input class="input" id="sWa" value="${esc(s.whatsapp || "")}" dir="ltr" inputmode="tel" placeholder="212600000000"><span class="hint">Format international sans « + » : 212 puis le numéro sans le 0.</span></div>
          ${inp("sEmail", "Email de contact", s.email, 'type="email" dir="ltr"')}
        </div>
        <div><button type="button" class="btn btn-ghost" id="sTestWa">${ICONS.whatsapp.replace("<svg", '<svg width="16" height="16"')}Tester le numéro</button></div>
      </div>

      <div class="card-panel" style="padding:1.3rem;display:grid;gap:1rem">
        <span class="section-label" style="margin:0">Page d'accueil</span>
        <div class="two">${inp("sAnnFr", "Bandeau d'annonce (FR)", s.announcement_fr)}${inp("sAnnAr", "شريط الإعلان (AR)", s.announcement_ar, 'dir="rtl"')}</div>
        <div class="two">${inp("sHtFr", "Titre principal (FR)", s.heroTitle_fr)}${inp("sHtAr", "العنوان الرئيسي (AR)", s.heroTitle_ar, 'dir="rtl"')}</div>
        <div class="two">${area("sHsFr", "Sous-titre (FR)", s.heroSubtitle_fr)}${area("sHsAr", "النص التوضيحي (AR)", s.heroSubtitle_ar, 'dir="rtl"')}</div>
        <span class="hint">Laissez le bandeau vide pour le masquer.</span>
      </div>

      <div class="card-panel" style="padding:1.3rem;display:grid;gap:1rem">
        <span class="section-label" style="margin:0">Réseaux sociaux</span>
        <div class="two">${inp("sIg", "Instagram (lien)", s.instagram, 'dir="ltr" placeholder="https://instagram.com/…"')}${inp("sFb", "Facebook (lien)", s.facebook, 'dir="ltr"')}</div>
        ${inp("sTt", "TikTok (lien)", s.tiktok, 'dir="ltr"')}
      </div>

      <div style="display:flex;gap:.7rem;justify-content:flex-end"><button class="btn btn-primary btn-lg" type="submit" id="sSave">Enregistrer les paramètres</button></div>

      <div class="card-panel" style="padding:1.3rem;display:grid;gap:1rem">
        <span class="section-label" style="margin:0">Données</span>
        <p class="hint" style="font-size:var(--fs-sm)">Téléchargez une sauvegarde de vos produits, catégories et paramètres.</p>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button type="button" class="btn btn-ghost" id="sExport">${ICONS.download.replace("<svg", '<svg width="16" height="16"')}Exporter (JSON)</button>
          <button type="button" class="btn btn-ghost" id="sSeed">Charger les produits d'exemple</button>
          ${S.db.mode === "demo" ? `<button type="button" class="btn btn-ghost" id="sReset" style="color:var(--rose)">Réinitialiser la démo</button>` : ""}
        </div>
      </div>
    </form>`;

  $("#sTestWa").onclick = () => {
    const n = digitsOnly($("#sWa").value);
    if (n.length < 10) return toast("Numéro trop court : utilisez le format 2126XXXXXXXX", true);
    window.open(`https://wa.me/${n}?text=${encodeURIComponent("Test de la boutique ✔")}`, "_blank");
  };
  $("#sForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const wa = digitsOnly($("#sWa").value);
    if (wa.length < 10) { toast("Le numéro WhatsApp doit être au format international (ex : 212612345678).", true); $("#sWa").focus(); return; }
    const data = {
      storeName: $("#sName").value.trim() || "Ma boutique", currency: $("#sCur").value.trim() || "DH",
      whatsapp: wa, email: $("#sEmail").value.trim(),
      announcement_fr: $("#sAnnFr").value.trim(), announcement_ar: $("#sAnnAr").value.trim(),
      heroTitle_fr: $("#sHtFr").value.trim(), heroTitle_ar: $("#sHtAr").value.trim(),
      heroSubtitle_fr: $("#sHsFr").value.trim(), heroSubtitle_ar: $("#sHsAr").value.trim(),
      instagram: $("#sIg").value.trim(), facebook: $("#sFb").value.trim(), tiktok: $("#sTt").value.trim()
    };
    const btn = $("#sSave"); btn.disabled = true;
    try { await S.db.saveSettings(data); S.settings = { ...S.settings, ...data }; toast("Paramètres enregistrés"); $(".sb-head .logo span").textContent = data.storeName; }
    catch (err) { toast(err.message, true); }
    btn.disabled = false;
  });
  $("#sExport").onclick = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), settings: S.settings, categories: S.categories, products: S.products }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `sauvegarde-boutique-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $("#sSeed").onclick = async () => { if (await confirmDialog("Ajouter les 8 produits et 4 catégories d'exemple ? (Les exemples existants avec le même identifiant seront remplacés.)", { okLabel: "Ajouter", danger: false })) seedExamples(); };
  $("#sReset")?.addEventListener("click", async () => { if (await confirmDialog("Effacer toutes les données de démo de ce navigateur ?", { okLabel: "Réinitialiser" })) S.db.resetDemo(); });
}

// ============================================================
//  DÉMARRAGE
// ============================================================
async function init() {
  try {
    S.db = await getDB();
    S.settings = await S.db.getSettings();
  } catch (e) {
    root.innerHTML = `<div class="auth-screen"><div class="auth-card"><h1>Connexion impossible</h1><p style="color:var(--mist);margin-top:.6rem">${esc(e.message)}</p><p class="hint" style="margin-top:1rem">Vérifiez la configuration Firebase dans assets/js/config.js.</p></div></div>`;
    return;
  }
  document.title = `Administration — ${S.settings.storeName}`;
  const hash = location.hash.slice(1);
  if (TITLES[hash]) S.view = hash;

  if (S.db.mode === "firebase") {
    try { if (await S.db.needsSetup()) { S.needsSetup = true; } } catch { /* règles pas encore publiées */ }
  }

  S.db.onAuth(async (user) => {
    if (S.settingUp) return; // création du 1er admin en cours
    S.user = user;
    if (!user) return S.needsSetup ? screenSetup() : screenLogin();
    if (user.noProfile || user.active === false) return screenNoAccess();
    root.innerHTML = `<div class="loading">Chargement…</div>`;
    try { await loadData(); }
    catch (e) { toast(e.message, true); }
    renderShell();
  });
}

init();
