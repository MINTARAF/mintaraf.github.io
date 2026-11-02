// ============================================================
//  SITE PUBLIC (index.html)
// ============================================================
import { getDB } from "./db.js";
import { t, tr, getLang, setLang, applyDir } from "./i18n.js";
import { ICONS, icon, logoMark } from "./icons.js";
import { esc, formatPrice, ticketId, digitsOnly, toIntl, safeUrl, lines, clip, store } from "./utils.js";
import { DEFAULT_SETTINGS, DEFAULT_CONTENT, DEFAULT_PACKS } from "./defaults.js";

const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");
const S = { db: null, settings: { ...DEFAULT_SETTINGS }, content: { ...DEFAULT_CONTENT }, packs: DEFAULT_PACKS };

const LIMITS = { name: 80, company: 80, phone: 20, city: 60, address: 200, category: 80, problem: 1500 };
const SECTIONS = { tarifs: "packs", "comment-ca-marche": "how", services: "services", questions: "faq", contact: "contact" };

const packTone = (p) => (p.mode === "onsite" ? "onsite" : p.highlight ? "urgent" : "standard");
const waNumber = () => toIntl(S.settings.whatsapp);
const waLink = (text = "") => `https://wa.me/${waNumber()}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

function toast(msg, error = false) {
  const el = document.createElement("div");
  el.className = "toast" + (error ? " err" : "");
  el.innerHTML = `${error ? ICONS.info : ICONS.checkCircle}<span>${esc(msg)}</span>`;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ---------- Morceaux réutilisables ----------
const checks = (text) => `<ul class="checks">${lines(text).map((l) => `<li>${ICONS.check}<span>${esc(l)}</span></li>`).join("")}</ul>`;

function packCard(p) {
  const tone = packTone(p);
  const badge = tr(p, "badge");
  return `<article class="pack t-${tone} ${p.highlight ? "highlight" : ""}">
    ${badge ? `<span class="pack-badge">${esc(badge)}</span>` : ""}
    <div class="pack-top">
      <span class="pack-icon">${icon(p.icon)}</span>
      <span class="tag ${p.mode === "onsite" ? "onsite" : "remote"}">${p.mode === "onsite" ? ICONS.pin : ICONS.screen}${t(p.mode === "onsite" ? "onsite" : "remote")}</span>
    </div>
    <h3>${esc(tr(p, "name"))}</h3>
    <p class="pack-delay">${p.mode === "onsite" ? ICONS.van : p.highlight ? ICONS.bolt : ICONS.clock}${esc(tr(p, "delay"))}</p>
    <div class="pack-price"><strong dir="ltr">${esc(formatPrice(p.price))}</strong><span>${t("per_intervention")}</span></div>
    <p class="pack-desc">${esc(tr(p, "desc"))}</p>
    ${checks(tr(p, "features"))}
    <a class="btn ${p.highlight ? "btn-primary" : "btn-outline"} btn-block" href="#/demande/${encodeURIComponent(p.id)}">${t("choose_pack")} ${ICONS.arrowRight.replace("<svg", '<svg class="flip"')}</a>
  </article>`;
}

function contactBand() {
  const s = S.settings;
  const tel = digitsOnly(s.phone);
  return `<section class="section" id="contact"><div class="wrap">
    <div class="cta-band">
      <div>
        <h2>${t("contact_title")}</h2>
        <p>${t("contact_sub")}</p>
        <div class="meta">
          ${tr(s, "hours") ? `<span>${ICONS.clock}${esc(tr(s, "hours"))}</span>` : ""}
          ${tr(s, "city") ? `<span>${ICONS.pin}${esc(tr(s, "city"))}</span>` : ""}
        </div>
      </div>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="#/tarifs">${t("see_packs")}</a>
        ${waNumber() ? `<a class="btn btn-wa btn-lg" href="${esc(waLink())}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp}${t("wa_write")}</a>` : ""}
        ${tel ? `<a class="btn btn-outline btn-lg" href="tel:${esc(tel)}">${ICONS.phone}${t("call")}</a>` : ""}
      </div>
    </div>
  </div></section>`;
}

// ---------- Pages ----------
function pageHome(section) {
  const c = S.content;
  const minPrice = Math.min(...S.packs.map((p) => Number(p.price) || 0));
  const demo = S.packs.find((p) => p.highlight) || S.packs[0];
  app.innerHTML = `
  <section class="hero"><div class="wrap hero-grid">
    <div>
      ${tr(c, "hero_kicker") ? `<span class="pill"><span class="dot"></span>${esc(tr(c, "hero_kicker"))}</span>` : ""}
      <h1>${esc(tr(c, "hero_title"))}</h1>
      <p class="hero-sub">${esc(tr(c, "hero_sub"))}</p>
      <div class="hero-actions">
        <a class="btn btn-primary btn-lg" href="#/tarifs">${t("see_packs")} ${ICONS.arrowRight.replace("<svg", '<svg class="flip"')}</a>
        ${waNumber() ? `<a class="btn btn-outline btn-lg" href="${esc(waLink())}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp}${t("wa_write")}</a>` : ""}
      </div>
      <ul class="hero-points">${lines(tr(c, "hero_points")).map((l) => `<li>${ICONS.checkCircle}${esc(l)}</li>`).join("")}</ul>
    </div>
    <div class="ticket" aria-label="${t("example")}">
      <div class="ticket-head">
        <div class="ticket-id">${t("demo_ticket")} <span dir="ltr">IT-7KQ2XA9M</span><small>${esc(tr(demo, "name"))} · ${t("example")}</small></div>
        <span class="tag ${demo?.highlight ? "urgent" : "remote"}">${demo?.highlight ? ICONS.bolt : ICONS.clock}${esc(tr(demo, "delay"))}</span>
      </div>
      <ol class="timeline">
        <li><span class="ic">${ICONS.check}</span>${t("demo_s1")}<time>10:02</time></li>
        <li><span class="ic">${ICONS.check}</span>${t("demo_s2")}<time>10:19</time></li>
        <li><span class="ic">${ICONS.check}</span>${t("demo_s3")}<time>10:41</time></li>
      </ol>
      <div class="ticket-foot"><span class="tag ok">${ICONS.checkCircle}${t("demo_s3")}</span><strong dir="ltr">${esc(formatPrice(demo?.price || minPrice))}</strong></div>
    </div>
  </div></section>

  <section class="section soft" id="packs"><div class="wrap">
    <div class="section-head center">
      <span class="kicker">${t("packs_kicker")}</span>
      <h2>${t("packs_title")}</h2>
      <p>${t("packs_sub")}</p>
    </div>
    <div class="packs">${S.packs.map(packCard).join("")}</div>
    ${tr(S.settings, "zone") ? `<p class="services-more">${esc(tr(S.settings, "zone"))}</p>` : ""}
  </div></section>

  <section class="section" id="how"><div class="wrap">
    <div class="section-head"><span class="kicker">${t("how_kicker")}</span><h2>${t("how_title")}</h2></div>
    <div class="steps">${(c.steps || []).map((st, i) => `
      <div class="step"><span class="step-num">${i + 1}</span><h3>${esc(tr(st, "title"))}</h3><p>${esc(tr(st, "text"))}</p></div>`).join("")}
    </div>
  </div></section>

  <section class="section soft" id="services"><div class="wrap">
    <div class="section-head"><span class="kicker">${t("services_kicker")}</span><h2>${t("services_title")}</h2></div>
    <div class="services">${(c.services || []).map((sv) => `
      <div class="service"><span class="ic">${icon(sv.icon)}</span><div><h3>${esc(tr(sv, "title"))}</h3><p>${esc(tr(sv, "text"))}</p></div></div>`).join("")}
    </div>
    <p class="services-more">${t("services_more")}</p>
  </div></section>

  <section class="section" id="why"><div class="wrap">
    <div class="section-head"><span class="kicker">${t("why_kicker")}</span><h2>${t("why_title")}</h2></div>
    <div class="why">${(c.why || []).map((w) => `
      <div class="why-item"><span class="ic">${icon(w.icon)}</span><h3>${esc(tr(w, "title"))}</h3><p>${esc(tr(w, "text"))}</p></div>`).join("")}
    </div>
  </div></section>

  <section class="section soft" id="faq"><div class="wrap">
    <div class="section-head center"><span class="kicker">${t("faq_kicker")}</span><h2>${t("faq_title")}</h2></div>
    <div class="faq">${(c.faq || []).map((f) => `
      <details><summary>${esc(tr(f, "q"))}${ICONS.down}</summary><p>${esc(tr(f, "a"))}</p></details>`).join("")}
    </div>
  </div></section>

  ${contactBand()}`;

  const id = SECTIONS[section];
  if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
  else window.scrollTo(0, 0);
}

function pageRequest(packId) {
  const p = S.packs.find((x) => x.id === packId);
  if (!p) return pageNotFound(t("err_unknown_pack"));
  const s = S.settings;
  const onsite = p.mode === "onsite";
  const anydesk = safeUrl(s.anydeskUrl);
  const cats = (S.content.services || []).map((sv) => tr(sv, "title")).filter(Boolean);
  const draft = store.get("it_draft", {});
  const v = (k) => esc(draft[k] || "");

  app.innerHTML = `
  <div class="wrap page-head">
    <a class="back-link" href="#/tarifs">${ICONS.arrowLeft}${t("req_back")}</a>
    <h1>${t("req_title")}</h1>
  </div>
  <div class="wrap req-grid">
    <aside class="req-side">
      <div class="card">
        <div class="summary-pack t-${packTone(p)}">
          <span class="pack-icon">${icon(p.icon)}</span>
          <div><h2>${esc(tr(p, "name"))}</h2><p>${esc(tr(p, "delay"))}</p></div>
        </div>
        ${checks(tr(p, "features"))}
        <div class="summary-price"><span>${t("per_intervention")}</span><strong dir="ltr">${esc(formatPrice(p.price))}</strong></div>
      </div>
      ${!onsite && anydesk ? `<div class="card side-note">
        <h3>${ICONS.download}${t("req_prepare")}</h3><p>${t("req_prepare_d")}</p>
        <a class="btn btn-outline btn-sm" href="${esc(anydesk)}" target="_blank" rel="noopener noreferrer">${t("req_download")} ${ICONS.external}</a>
      </div>` : ""}
      ${tr(s, "payment") ? `<div class="card side-note"><h3>${ICONS.tag}${t("req_payment")}</h3><p>${esc(tr(s, "payment"))}</p></div>` : ""}
    </aside>

    <form class="card" id="reqForm" novalidate autocomplete="on">
      <div class="form-grid two">
        <div class="field"><label for="f_name">${t("req_name")}</label>
          <input class="input" id="f_name" name="name" autocomplete="name" maxlength="${LIMITS.name}" required value="${v("name")}"></div>
        <div class="field"><label for="f_company">${t("req_company")} <span class="opt">(${t("optional")})</span></label>
          <input class="input" id="f_company" name="company" autocomplete="organization" maxlength="${LIMITS.company}" value="${v("company")}"></div>
        <div class="field"><label for="f_phone">${t("req_phone")}</label>
          <input class="input" id="f_phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="${LIMITS.phone}" placeholder="06 12 34 56 78" required value="${v("phone")}"></div>
        <div class="field"><label for="f_city">${t("req_city")}</label>
          <input class="input" id="f_city" name="city" autocomplete="address-level2" maxlength="${LIMITS.city}" required value="${v("city")}"></div>
        ${onsite ? `<div class="field span-2"><label for="f_address">${t("req_address")}</label>
          <input class="input" id="f_address" name="address" autocomplete="street-address" maxlength="${LIMITS.address}" required value="${v("address")}"></div>` : ""}
        <div class="field span-2"><label for="f_category">${t("req_category")}</label>
          <select class="select" id="f_category" name="category" required>
            <option value="">${t("req_category_ph")}</option>
            ${cats.map((c) => `<option>${esc(c)}</option>`).join("")}
            <option>${t("req_other")}</option>
          </select></div>
        <div class="field span-2"><label for="f_problem">${t("req_problem")}</label>
          <textarea class="textarea" id="f_problem" name="problem" maxlength="${LIMITS.problem}" placeholder="${esc(t("req_problem_ph"))}" required></textarea></div>
        ${!onsite ? `<div class="field span-2"><span class="label" id="prefLabel">${t("req_pref")}</span>
          <div class="choices" role="radiogroup" aria-labelledby="prefLabel">
            <label class="choice"><input type="radio" name="pref" value="anydesk" checked><span>${ICONS.screen}${t("pref_anydesk")}</span></label>
            <label class="choice"><input type="radio" name="pref" value="video"><span>${ICONS.video}${t("pref_video")}</span></label>
            <label class="choice"><input type="radio" name="pref" value="any"><span>${ICONS.headset}${t("pref_any")}</span></label>
          </div></div>` : ""}
        <div class="hp" aria-hidden="true"><label for="f_website">Website</label><input id="f_website" name="website" tabindex="-1" autocomplete="off"></div>
      </div>
      <div class="form-foot">
        <div class="form-error" id="formError" role="alert" hidden></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit" id="sendBtn">${t("req_send")} · <bdi dir="ltr">${esc(formatPrice(p.price))}</bdi></button>
        <p class="hint">${ICONS.whatsapp}<span>${t("req_note")}</span></p>
      </div>
    </form>
  </div>`;
  window.scrollTo(0, 0);

  const form = $("#reqForm");
  form.addEventListener("input", (e) => {
    e.target.classList?.remove("invalid");
    const d = Object.fromEntries(["name", "company", "phone", "city", "address"].map((k) => [k, form.elements[k]?.value || draft[k] || ""]));
    store.set("it_draft", d); // pour ne pas tout retaper la prochaine fois (sur cet appareil)
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); submitRequest(form, p); });
}

async function submitRequest(form, p) {
  const f = form.elements;
  const val = (k) => clip(f[k]?.value || "", LIMITS[k] || 200);
  const errBox = $("#formError");
  const fail = (msg, field) => {
    errBox.textContent = msg; errBox.hidden = false;
    if (field) { f[field].classList.add("invalid"); f[field].focus(); }
  };
  errBox.hidden = true;
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

  if (f.website.value) return; // robot
  const data = {
    name: val("name"), company: val("company"), phone: val("phone"), city: val("city"),
    address: p.mode === "onsite" ? val("address") : "", category: val("category"), problem: val("problem")
  };
  if (data.name.length < 2) return fail(t("err_name"), "name");
  if (digitsOnly(data.phone).length < 9) return fail(t("err_phone"), "phone");
  if (data.city.length < 2) return fail(t("err_city"), "city");
  if (p.mode === "onsite" && data.address.length < 5) return fail(t("err_address"), "address");
  if (!data.category) return fail(t("err_category"), "category");
  if (data.problem.length < 10) return fail(t("err_problem"), "problem");
  const last = store.get("it_last_sent", 0);
  if (Date.now() - last < 60_000) return fail(t("err_wait"));

  const pref = p.mode === "onsite" ? "onsite" : (form.querySelector("input[name=pref]:checked")?.value || "any");
  const req = {
    id: ticketId(), packId: p.id, packName: clip(p.name_fr || tr(p, "name"), 80), price: Number(p.price) || 0, mode: p.mode === "onsite" ? "onsite" : "remote",
    ...data, contactPref: pref, lang: getLang(), status: "new", note: "", assignedTo: ""
  };
  const url = waLink(buildMessage(req, p));

  // WhatsApp s'ouvre tout de suite (pendant le clic, sinon le navigateur le bloque)
  if (waNumber()) window.open(url, "_blank", "noopener");

  const btn = $("#sendBtn");
  btn.disabled = true; btn.textContent = t("req_sending");
  let saved = true;
  try { await S.db.createRequest(req); }
  catch (err) { saved = false; console.warn("Demande non enregistrée :", err?.message); }
  store.set("it_last_sent", Date.now());
  try { sessionStorage.setItem("it_last", JSON.stringify({ id: req.id, url, packId: p.id, saved })); } catch {}
  location.hash = `#/merci/${req.id}`;
}

function buildMessage(r, p) {
  const sep = "━━━━━━━━━━━━";
  const prefLabel = { anydesk: t("pref_anydesk"), video: t("pref_video"), any: t("pref_any"), onsite: t("onsite") }[r.contactPref];
  return [
    `🛠️ *${t("msg_title")}* — ${r.id}`,
    `📦 ${t("msg_pack")} : ${tr(p, "name")} (${formatPrice(r.price)})`,
    sep,
    `👤 ${t("msg_name")} : ${r.name}`,
    r.company && `🏢 ${t("msg_company")} : ${r.company}`,
    `📱 ${t("msg_phone")} : ${r.phone}`,
    `📍 ${t("msg_city")} : ${r.city}`,
    r.address && `🏠 ${t("msg_address")} : ${r.address}`,
    sep,
    `🔧 ${t("msg_category")} : ${r.category}`,
    r.problem,
    prefLabel && `💻 ${t("msg_pref")} : ${prefLabel}`,
    sep,
    t("msg_footer")
  ].filter(Boolean).join("\n");
}

function pageDone(id) {
  let last = {};
  try { last = JSON.parse(sessionStorage.getItem("it_last") || "{}"); } catch {}
  const mine = last.id === id;
  const p = S.packs.find((x) => x.id === last.packId);
  const anydesk = safeUrl(S.settings.anydeskUrl);
  app.innerHTML = `<div class="wrap"><div class="done">
    <div class="done-ic">${ICONS.check}</div>
    <h1>${t("ok_title")}</h1>
    <div class="done-ticket"><small>${t("ok_ticket")}</small><strong>${esc(id)}</strong></div>
    <p>${t("ok_text")}</p>
    ${mine && !last.saved ? `<div class="warn">${t("ok_saved_fail")}</div>` : ""}
    ${p ? `<div class="card done-next t-${packTone(p)}"><h2>${t("ok_next")}</h2>
      <p class="pack-delay">${p.mode === "onsite" ? ICONS.van : p.highlight ? ICONS.bolt : ICONS.clock}${esc(tr(p, "delay"))}</p>
      ${p.mode !== "onsite" && anydesk ? `<p class="hint">${t("req_prepare_d")}</p>` : ""}
    </div>` : ""}
    <div class="done-actions">
      ${mine && last.url ? `<a class="btn btn-wa btn-lg" href="${esc(last.url)}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp}${t("ok_open_wa")}</a>` : ""}
      ${p && p.mode !== "onsite" && anydesk ? `<a class="btn btn-outline btn-lg" href="${esc(anydesk)}" target="_blank" rel="noopener noreferrer">${ICONS.download}${t("req_download")}</a>` : ""}
      <a class="btn btn-ghost btn-lg" href="#/">${t("ok_home")}</a>
    </div>
  </div></div>`;
  window.scrollTo(0, 0);
}

function pageNotFound(msg = t("not_found")) {
  app.innerHTML = `<div class="wrap empty"><p>${esc(msg)}</p><p><a class="btn btn-primary" href="#/">${t("ok_home")}</a></p></div>`;
}

// ---------- Routeur ----------
function route() {
  closeMenu();
  const [, page = "", arg = ""] = (location.hash || "#/").split("/");
  const a = decodeURIComponent(arg);
  if (page === "demande") pageRequest(a);
  else if (page === "merci") pageDone(a);
  else if (page === "" || SECTIONS[page]) pageHome(page);
  else pageNotFound();
  app.focus({ preventScroll: true });
}

// ---------- En-tête, menu, pied de page ----------
const navLinks = () => [
  ["tarifs", "nav_packs"], ["comment-ca-marche", "nav_how"], ["services", "nav_services"], ["questions", "nav_faq"], ["contact", "nav_contact"]
].map(([h, k]) => `<a href="#/${h}">${t(k)}</a>`).join("");

function closeMenu() { $("#mobileNav").hidden = true; $("#menuBtn").setAttribute("aria-expanded", "false"); }

function renderChrome() {
  const s = S.settings, c = S.content;
  document.title = `${s.brand} — ${tr(s, "tagline")}`;
  $("#logo").innerHTML = `${logoMark()}<span>${esc(s.brand)}</span>`;
  $("#logo").setAttribute("aria-label", s.brand);
  $("#mainNav").innerHTML = navLinks();
  $("#mobileNav").innerHTML = navLinks() + `<a class="btn btn-primary" href="#/tarifs">${t("cta_request")}</a>`;
  $("#langBtn").innerHTML = `${ICONS.globe}<span>${t("lang_switch")}</span>`;
  $("#menuBtn").innerHTML = ICONS.menu;

  const ann = $("#announce");
  ann.textContent = tr(c, "announce");
  ann.hidden = !(c.announceOn && tr(c, "announce"));

  const wa = $("#waFloat");
  wa.innerHTML = ICONS.whatsapp;
  wa.href = waLink();
  wa.hidden = !waNumber();

  const tel = digitsOnly(s.phone);
  const socials = [["facebook", s.facebook], ["instagram", s.instagram], ["linkedin", s.linkedin]]
    .map(([k, u]) => [k, safeUrl(u)]).filter(([, u]) => u)
    .map(([k, u]) => `<a class="icon-btn" href="${esc(u)}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${ICONS[k]}</a>`).join("");
  $("#footerGrid").innerHTML = `
    <div>
      <a href="#/" class="logo">${logoMark()}<span>${esc(s.brand)}</span></a>
      <p class="hint">${esc(tr(s, "tagline"))}</p>
      ${socials ? `<div class="socials">${socials}</div>` : ""}
    </div>
    <div><h4>${t("footer_links")}</h4><ul>
      <li><a href="#/tarifs">${t("nav_packs")}</a></li><li><a href="#/comment-ca-marche">${t("nav_how")}</a></li>
      <li><a href="#/services">${t("nav_services")}</a></li><li><a href="#/questions">${t("nav_faq")}</a></li></ul></div>
    <div><h4>${t("footer_contact")}</h4><ul>
      ${tel ? `<li><a class="row" href="tel:${esc(tel)}">${ICONS.phone}<span dir="ltr">${esc(s.phone)}</span></a></li>` : ""}
      ${waNumber() ? `<li><a class="row" href="${esc(waLink())}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp}WhatsApp</a></li>` : ""}
      ${s.email ? `<li><a class="row" href="mailto:${esc(s.email)}">${ICONS.mail}${esc(s.email)}</a></li>` : ""}
      ${tr(s, "hours") ? `<li class="row">${ICONS.clock}${esc(tr(s, "hours"))}</li>` : ""}
    </ul></div>`;
  $("#footerBottom").textContent = t("footer_rights", new Date().getFullYear(), s.brand);
}

async function init() {
  applyDir();
  $("#langBtn").addEventListener("click", () => { setLang(getLang() === "fr" ? "ar" : "fr"); renderChrome(); route(); });
  $("#menuBtn").addEventListener("click", () => {
    const nav = $("#mobileNav");
    nav.hidden = !nav.hidden;
    $("#menuBtn").setAttribute("aria-expanded", String(!nav.hidden));
  });
  $("#mobileNav").addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  window.addEventListener("hashchange", route);
  // Un clic sur le lien de la section déjà affichée doit quand même faire défiler
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute("href") === location.hash) { e.preventDefault(); route(); }
  });

  try {
    S.db = await getDB();
    const [settings, content, packs] = await Promise.all([S.db.getSettings(), S.db.getContent(), S.db.listPacks()]);
    S.settings = settings; S.content = content; S.packs = packs;
  } catch (err) {
    console.warn("Contenu par défaut utilisé :", err?.message);
  }
  renderChrome();
  route();
}

init();
