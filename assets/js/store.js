// ============================================================
//  BOUTIQUE (index.html)
// ============================================================
import { getDB } from "./db.js";
import { t, tr, getLang, setLang, applyDir } from "./i18n.js";
import { ICONS, starLogo, heroStar, bgStar } from "./icons.js";
import { esc, formatPrice, productImage, orderId, debounce, digitsOnly, store } from "./utils.js";

const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");

const state = { db: null, settings: {}, products: [], categories: [], cart: store.get("ds_cart", []) };

// ---------- Panier ----------
const cartItems = () =>
  state.cart
    .map((l) => ({ ...l, product: state.products.find((p) => p.id === l.id) }))
    .filter((l) => l.product);
const cartTotal = () => cartItems().reduce((s, l) => s + Number(l.product.price || 0) * l.qty, 0);
const cartCount = () => cartItems().reduce((s, l) => s + l.qty, 0);
const saveCart = () => { store.set("ds_cart", state.cart); updateCartBadge(true); renderDrawer(); };

function addToCart(id, qty = 1, { silent = false } = {}) {
  const line = state.cart.find((l) => l.id === id);
  if (line) line.qty = Math.min(99, line.qty + qty); else state.cart.push({ id, qty });
  saveCart();
  if (!silent) {
    const p = state.products.find((x) => x.id === id);
    toast(`${t("added")} · ${esc(tr(p, "title"))}`, { action: { label: t("cart"), fn: openDrawer } });
  }
}
function setQty(id, qty) {
  if (qty <= 0) state.cart = state.cart.filter((l) => l.id !== id);
  else { const l = state.cart.find((x) => x.id === id); if (l) l.qty = Math.min(99, qty); }
  saveCart();
}
function updateCartBadge(bump = false) {
  const el = $("#cartCount");
  const n = cartCount();
  el.textContent = n;
  el.hidden = n === 0;
  if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
}

// ---------- Toasts ----------
function toast(html, { error = false, action = null } = {}) {
  const el = document.createElement("div");
  el.className = "toast" + (error ? " err" : "");
  el.innerHTML = `${error ? ICONS.info : ICONS.checkCircle}<span>${html}</span>`;
  if (action) {
    const a = document.createElement("a");
    a.href = "#"; a.textContent = action.label;
    a.addEventListener("click", (e) => { e.preventDefault(); action.fn(); el.remove(); });
    el.appendChild(a);
  }
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ---------- Tiroir ----------
function openDrawer() {
  renderDrawer();
  const ov = $("#overlay"), dr = $("#drawer");
  ov.hidden = false;
  requestAnimationFrame(() => { ov.classList.add("show"); dr.classList.add("open"); });
  dr.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#drawerClose").focus(), 50);
}
function closeDrawer() {
  const ov = $("#overlay"), dr = $("#drawer");
  ov.classList.remove("show"); dr.classList.remove("open");
  dr.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => (ov.hidden = true), 250);
}
function renderDrawer() {
  const items = cartItems();
  const cur = state.settings.currency;
  const body = $("#drawerBody"), foot = $("#drawerFoot");
  if (!items.length) {
    body.innerHTML = `<div class="empty-state">${ICONS.cart}<div><strong>${t("cart_empty")}</strong><p class="hint">${t("cart_empty_hint")}</p></div>
      <a href="#/shop" class="btn btn-ghost" data-close>${t("browse")}</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map((l) => `
    <div class="line-item">
      <img src="${productImage(l.product)}" alt="" loading="lazy">
      <div>
        <a href="#/p/${encodeURIComponent(l.id)}" class="li-title" data-close>${esc(tr(l.product, "title"))}</a>
        <div class="li-meta">
          <div class="qty sm">
            <button data-dec="${esc(l.id)}" aria-label="-">−</button><span>${l.qty}</span><button data-inc="${esc(l.id)}" aria-label="+">+</button>
          </div>
          <button class="li-remove" data-rm="${esc(l.id)}">${t("remove")}</button>
        </div>
      </div>
      <div class="li-price">${formatPrice(l.product.price * l.qty, cur)}</div>
    </div>`).join("");
  foot.innerHTML = `
    <div class="sum-row total"><span>${t("total")}</span><span>${formatPrice(cartTotal(), cur)}</span></div>
    <a href="#/checkout" class="btn btn-primary btn-lg btn-block" data-close>${t("checkout")}</a>
    <button class="btn btn-ghost btn-block" data-close>${t("continue")}</button>`;
}

// ---------- Carte produit ----------
const catName = (id) => tr(state.categories.find((c) => c.id === id), "name");
const discount = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

function cardHTML(p) {
  const cur = state.settings.currency;
  const d = discount(p);
  const badge = tr(p, "badge");
  return `
  <article class="card">
    <a href="#/p/${encodeURIComponent(p.id)}" class="card-media" aria-label="${esc(tr(p, "title"))}">
      <img src="${productImage(p)}" alt="" loading="lazy">
      ${badge ? `<span class="badge">${esc(badge)}</span>` : ""}
      ${d ? `<span class="badge badge-sale">${t("save", d)}</span>` : ""}
    </a>
    <div class="card-body">
      <span class="card-cat">${esc(catName(p.category))}</span>
      <a href="#/p/${encodeURIComponent(p.id)}" class="card-title">${esc(tr(p, "title"))}</a>
      <div class="price-row">
        <span class="price">${formatPrice(p.price, cur)}</span>
        ${d ? `<span class="old-price">${formatPrice(p.oldPrice, cur)}</span>` : ""}
      </div>
    </div>
    <button class="btn btn-ghost card-add" data-add="${esc(p.id)}">${t("add_to_cart")}</button>
  </article>`;
}

// ---------- Pages ----------
function pageHome() {
  const s = state.settings;
  const featured = state.products.filter((p) => p.featured).slice(0, 4);
  const showcase = featured[0] || state.products[0];
  const newest = state.products.filter((p) => !featured.includes(p)).slice(0, 8);
  const cur = s.currency;

  app.innerHTML = `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <h1>${esc(tr(s, "heroTitle"))}</h1>
        <p class="hero-sub">${esc(tr(s, "heroSubtitle"))}</p>
        <div class="hero-actions">
          <a href="#/shop" class="btn btn-primary btn-lg">${t("hero_cta")}</a>
          <a href="#/faq" class="btn btn-ghost btn-lg">${t("hero_cta2")}</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-star">${heroStar()}</div>
        ${showcase ? `
        <a class="hero-card" href="#/p/${encodeURIComponent(showcase.id)}">
          <img src="${productImage(showcase)}" alt="">
          <div class="hc-body"><div class="hc-title">${esc(tr(showcase, "title"))}</div><div class="hc-price">${formatPrice(showcase.price, cur)}</div></div>
        </a>` : ""}
      </div>
    </div>
  </section>

  ${trustHTML()}

  ${state.categories.length ? `
  <section class="section">
    <div class="wrap">
      <div class="section-head"><h2>${t("categories")}</h2></div>
      <div class="cat-grid">
        ${state.categories.map((c) => {
          const n = state.products.filter((p) => p.category === c.id).length;
          return `<a class="cat-tile" href="#/shop?cat=${encodeURIComponent(c.id)}">
            <span class="ci">${esc(c.icon || "✦")}</span>
            <div><strong>${esc(tr(c, "name"))}</strong><span>${t("products_count", n)}</span></div>
            <span class="bg-star">${bgStar()}</span>
          </a>`;
        }).join("")}
      </div>
    </div>
  </section>` : ""}

  ${featured.length ? `
  <section class="section" style="padding-top:0">
    <div class="wrap">
      <div class="section-head"><h2>${t("featured")}</h2><a href="#/shop">${t("see_all")}</a></div>
      <div class="grid">${featured.map(cardHTML).join("")}</div>
    </div>
  </section>` : ""}

  ${newest.length || !featured.length ? `
  <section class="section" style="padding-top:0">
    <div class="wrap">
      <div class="section-head"><h2>${t("new_arrivals")}</h2><a href="#/shop">${t("see_all")}</a></div>
      ${newest.length ? `<div class="grid">${newest.map(cardHTML).join("")}</div>` : emptyHTML(t("no_results"))}
    </div>
  </section>` : ""}

  ${howHTML()}
  ${faqHTML()}`;
}

const trustHTML = () => `
  <section class="trust" aria-label="Avantages">
    <div class="wrap trust-grid">
      <div class="trust-item">${ICONS.bolt}<strong>${t("trust_instant")}</strong><span>${t("trust_instant_d")}</span></div>
      <div class="trust-item">${ICONS.shield}<strong>${t("trust_secure")}</strong><span>${t("trust_secure_d")}</span></div>
      <div class="trust-item">${ICONS.headset}<strong>${t("trust_support")}</strong><span>${t("trust_support_d")}</span></div>
      <div class="trust-item">${ICONS.infinity}<strong>${t("trust_access")}</strong><span>${t("trust_access_d")}</span></div>
    </div>
  </section>`;

const howHTML = () => `
  <section class="section" id="how" style="padding-top:0">
    <div class="wrap">
      <div class="section-head"><h2>${t("how_title")}</h2></div>
      <div class="steps">
        ${[1, 2, 3].map((i) => `<div class="step"><span class="step-n">${i}</span><div><strong>${t("how_" + i)}</strong><span>${t("how_" + i + "d")}</span></div></div>`).join("")}
      </div>
    </div>
  </section>`;

const faqHTML = () => `
  <section class="section" id="faq" style="padding-top:0">
    <div class="wrap">
      <div class="section-head"><h2>${t("faq_title")}</h2></div>
      <div class="faq">${t("faq").map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
    </div>
  </section>`;

const emptyHTML = (msg, action = "") => `<div class="empty-state">${ICONS.box}<p>${msg}</p>${action}</div>`;

function pageShop(params) {
  const cat = params.get("cat") || "";
  const q = (params.get("q") || "").trim().toLowerCase();
  const sort = params.get("sort") || "new";
  let list = state.products.filter((p) => (!cat || p.category === cat));
  if (q) list = list.filter((p) => [p.title_fr, p.title_ar, p.short_fr, p.short_ar].join(" ").toLowerCase().includes(q));
  if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);

  const link = (patch) => {
    const p = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    const s = p.toString();
    return "#/shop" + (s ? "?" + s : "");
  };
  const lang = getLang();
  app.innerHTML = `
  <div class="wrap">
    <div class="page-title"><h1>${cat ? esc(catName(cat)) : t("nav_shop")}</h1></div>
    <div class="shop-tools">
      <div class="chips" role="tablist">
        <a class="chip ${!cat ? "active" : ""}" href="${link({ cat: "" })}">${t("all")}</a>
        ${state.categories.map((c) => `<a class="chip ${cat === c.id ? "active" : ""}" href="${link({ cat: c.id })}">${esc(c.icon || "")} ${esc(tr(c, "name"))}</a>`).join("")}
      </div>
      <div class="shop-meta">
        <span>${t("products_count", list.length)}${q ? ` · “${esc(params.get("q"))}”` : ""}</span>
        <select class="select" id="sortSel" aria-label="Tri">
          <option value="new" ${sort === "new" ? "selected" : ""}>${lang === "ar" ? "الأحدث" : "Plus récents"}</option>
          <option value="asc" ${sort === "asc" ? "selected" : ""}>${lang === "ar" ? "الثمن: من الأقل" : "Prix croissant"}</option>
          <option value="desc" ${sort === "desc" ? "selected" : ""}>${lang === "ar" ? "الثمن: من الأعلى" : "Prix décroissant"}</option>
        </select>
      </div>
    </div>
    ${list.length ? `<div class="grid">${list.map(cardHTML).join("")}</div>`
      : emptyHTML(t("no_results"), `<a class="btn btn-ghost" href="#/shop">${t("clear_filters")}</a>`)}
    <div style="height:4rem"></div>
  </div>`;
  $("#sortSel").addEventListener("change", (e) => (location.hash = link({ sort: e.target.value === "new" ? "" : e.target.value })));
}

function pageProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) {
    app.innerHTML = `<div class="wrap">${emptyHTML(t("not_found"), `<a class="btn btn-primary" href="#/shop">${t("browse")}</a>`)}</div>`;
    return;
  }
  const cur = state.settings.currency;
  const d = discount(p);
  const features = tr(p, "features").split("\n").map((x) => x.trim()).filter(Boolean);
  const related = state.products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const more = related.length < 4 ? state.products.filter((x) => x.id !== p.id && !related.includes(x)).slice(0, 4 - related.length) : [];
  let qty = 1;
  document.title = `${tr(p, "title")} — ${state.settings.storeName}`;

  app.innerHTML = `
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="#/">${t("nav_home")}</a><span>/</span>
      <a href="#/shop?cat=${encodeURIComponent(p.category || "")}">${esc(catName(p.category) || t("nav_shop"))}</a><span>/</span>
      <span>${esc(tr(p, "title"))}</span>
    </nav>
    <div class="pdp">
      <div class="pdp-media">
        <img src="${productImage(p)}" alt="${esc(tr(p, "title"))}">
        ${tr(p, "badge") ? `<span class="badge">${esc(tr(p, "badge"))}</span>` : ""}
      </div>
      <div>
        <h1>${esc(tr(p, "title"))}</h1>
        ${tr(p, "short") ? `<p class="pdp-short">${esc(tr(p, "short"))}</p>` : ""}
        <div class="pdp-price">
          <span class="price">${formatPrice(p.price, cur)}</span>
          ${d ? `<span class="old-price">${formatPrice(p.oldPrice, cur)}</span><span class="save-pill">${t("you_save", formatPrice(p.oldPrice - p.price, cur))}</span>` : ""}
        </div>
        <div class="pdp-buy">
          <div class="pdp-buy-row">
            <div class="qty" aria-label="${t("qty")}">
              <button id="qDec" aria-label="-">−</button><span id="qVal">1</span><button id="qInc" aria-label="+">+</button>
            </div>
            <button class="btn btn-ghost btn-lg" id="addBtn">${t("add_to_cart")}</button>
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="buyBtn">${t("buy_now")}</button>
        </div>
        <div class="pdp-assure">
          <div>${ICONS.bolt}<span>${t("trust_instant_d")}</span></div>
          <div>${ICONS.headset}<span>${t("trust_support_d")}</span></div>
        </div>
        ${features.length ? `
        <div class="pdp-features">
          <h3>${t("whats_included")}</h3>
          <ul>${features.map((f) => `<li>${ICONS.check}<span>${esc(f)}</span></li>`).join("")}</ul>
        </div>` : ""}
        ${tr(p, "description") ? `<div class="pdp-desc"><h3>${t("description")}</h3><p>${esc(tr(p, "description"))}</p></div>` : ""}
      </div>
    </div>
    ${related.length + more.length ? `
    <section class="section" style="padding-top:1rem">
      <div class="section-head"><h2>${t("related")}</h2></div>
      <div class="grid">${[...related, ...more].map(cardHTML).join("")}</div>
    </section>` : ""}
  </div>`;

  const qv = $("#qVal");
  $("#qDec").onclick = () => { qty = Math.max(1, qty - 1); qv.textContent = qty; };
  $("#qInc").onclick = () => { qty = Math.min(99, qty + 1); qv.textContent = qty; };
  $("#addBtn").onclick = () => addToCart(p.id, qty);
  $("#buyBtn").onclick = () => { addToCart(p.id, qty, { silent: true }); location.hash = "#/checkout"; };
}

function pageCheckout() {
  const items = cartItems();
  const cur = state.settings.currency;
  if (!items.length) {
    app.innerHTML = `<div class="wrap">${emptyHTML(`<strong>${t("cart_empty")}</strong><br>${t("cart_empty_hint")}`, `<a class="btn btn-primary" href="#/shop">${t("browse")}</a>`)}</div>`;
    return;
  }
  const saved = store.get("ds_customer", {});
  app.innerHTML = `
  <div class="wrap checkout">
    <div>
      <h1 style="margin-bottom:1.4rem">${t("co_title")}</h1>
      <form class="panel" id="coForm" novalidate>
        <h2>${t("co_info")}</h2>
        <div class="form-grid">
          <div class="field"><label for="coName">${t("co_name")}</label>
            <input class="input" id="coName" autocomplete="name" required value="${esc(saved.name || "")}"><span class="error-text" id="errName" hidden></span></div>
          <div class="field"><label for="coPhone">${t("co_phone")}</label>
            <input class="input" id="coPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 XX XX XX XX" required value="${esc(saved.phone || "")}" dir="ltr"><span class="error-text" id="errPhone" hidden></span></div>
          <div class="field"><label for="coEmail">${t("co_email")}</label>
            <input class="input" id="coEmail" type="email" autocomplete="email" value="${esc(saved.email || "")}" dir="ltr"><span class="hint">${t("co_email_hint")}</span></div>
          <div class="field"><label for="coNote">${t("co_note")}</label>
            <textarea class="textarea" id="coNote" rows="3"></textarea></div>
        </div>
        <button type="submit" class="btn btn-wa btn-lg btn-block" style="margin-top:1.4rem">${ICONS.whatsapp.replace("<svg", '<svg width="22" height="22"')}<span>${t("co_send")}</span></button>
        <p class="co-note">${ICONS.lock}<span>${t("co_secure")}</span></p>
      </form>
    </div>
    <aside class="panel sticky">
      <h2>${t("co_summary")}</h2>
      ${items.map((l) => `
        <div class="summary-item">
          <img src="${productImage(l.product)}" alt="">
          <div><div class="li-title">${esc(tr(l.product, "title"))}</div><div class="qn">× ${l.qty}</div></div>
          <div class="li-price">${formatPrice(l.product.price * l.qty, cur)}</div>
        </div>`).join("")}
      <div style="border-top:1px solid var(--line-soft);margin-top:.8rem;padding-top:1rem;display:grid;gap:.5rem">
        <div class="sum-row total"><span>${t("total")}</span><span>${formatPrice(cartTotal(), cur)}</span></div>
      </div>
    </aside>
  </div>`;

  $("#coForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#coName").value.trim();
    const phone = $("#coPhone").value.trim();
    const email = $("#coEmail").value.trim();
    const note = $("#coNote").value.trim();
    let ok = true;
    const setErr = (input, errEl, msg) => {
      input.classList.toggle("invalid", !!msg);
      errEl.hidden = !msg; errEl.textContent = msg || "";
      if (msg) { ok = false; }
    };
    setErr($("#coName"), $("#errName"), name.length < 2 ? t("co_err_name") : "");
    setErr($("#coPhone"), $("#errPhone"), digitsOnly(phone).length < 9 ? t("co_err_phone") : "");
    if (!ok) { (name.length < 2 ? $("#coName") : $("#coPhone")).focus(); return; }

    const items = cartItems();
    const order = {
      id: orderId(),
      createdAt: Date.now(),
      status: "new",
      lang: getLang(),
      currency: cur,
      customer: { name, phone, email, note },
      items: items.map((l) => ({ id: l.id, title: l.product.title_fr || tr(l.product, "title"), title_ar: l.product.title_ar || "", price: Number(l.product.price), qty: l.qty })),
      total: cartTotal()
    };
    store.set("ds_customer", { name, phone, email });

    const url = whatsappURL(order);
    // On ouvre WhatsApp tout de suite (dans le geste du clic) pour éviter le blocage des popups
    const win = window.open(url, "_blank");
    state.db.createOrder(order).catch((err) => console.warn("Commande non enregistrée :", err));
    store.set("ds_last_order", { id: order.id, url });
    state.cart = [];
    saveCart();
    location.hash = `#/done/${order.id}`;
    if (!win) setTimeout(() => (location.href = url), 400);
  });
}

function buildMessage(order) {
  const cur = order.currency;
  const L = (k) => t(k);
  const lines = [];
  lines.push(`🛒 *${L("msg_title")}* — ${order.id}`);
  lines.push(`🏪 ${state.settings.storeName}`);
  lines.push("━━━━━━━━━━━━");
  lines.push(`👤 ${L("msg_name")} : ${order.customer.name}`);
  lines.push(`📱 ${L("msg_phone")} : ${order.customer.phone}`);
  if (order.customer.email) lines.push(`📧 ${L("msg_email")} : ${order.customer.email}`);
  lines.push("━━━━━━━━━━━━");
  lines.push(`📦 *${L("msg_items")} :*`);
  order.items.forEach((it, i) => {
    const title = getLang() === "ar" && it.title_ar ? it.title_ar : it.title;
    lines.push(`${i + 1}. ${title} × ${it.qty} = ${formatPrice(it.price * it.qty, cur)}`);
  });
  lines.push("━━━━━━━━━━━━");
  lines.push(`💰 *${L("msg_total")} : ${formatPrice(order.total, cur)}*`);
  if (order.customer.note) lines.push(`📝 ${L("msg_note")} : ${order.customer.note}`);
  lines.push("");
  lines.push(L("msg_footer"));
  return lines.join("\n");
}
const whatsappURL = (order) => `https://wa.me/${digitsOnly(state.settings.whatsapp)}?text=${encodeURIComponent(buildMessage(order))}`;

function pageDone(id) {
  const last = store.get("ds_last_order", {});
  const url = last.id === id ? last.url : `https://wa.me/${digitsOnly(state.settings.whatsapp)}`;
  app.innerHTML = `
  <div class="wrap success">
    <div class="seal">${starLogo()}</div>
    <h1>${t("ok_title")}</h1>
    <p>${t("ok_text", `<strong style="color:var(--sand)">${esc(id)}</strong>`)}</p>
    <a class="btn btn-wa btn-lg" href="${esc(url)}" target="_blank" rel="noopener">${ICONS.whatsapp.replace("<svg", '<svg width="22" height="22"')}<span>${t("ok_open")}</span></a>
    <a class="btn btn-ghost" href="#/">${t("ok_back")}</a>
  </div>`;
}

function pageFaq() {
  app.innerHTML = `<div style="padding-top:2.5rem"></div>${howHTML()}${faqHTML()}`;
}

// ---------- Routeur ----------
function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [path, qs] = hash.split("?");
  const params = new URLSearchParams(qs || "");
  const parts = path.split("/").filter(Boolean);
  document.title = `${state.settings.storeName} — ${getLang() === "ar" ? "منتجات رقمية" : "Produits digitaux"}`;
  let key = "home";
  if (parts[0] === "shop") { key = "shop"; pageShop(params); }
  else if (parts[0] === "p" && parts[1]) { key = "product"; pageProduct(decodeURIComponent(parts[1])); }
  else if (parts[0] === "checkout") { key = "checkout"; pageCheckout(); }
  else if (parts[0] === "done") { key = "done"; pageDone(decodeURIComponent(parts[1] || "")); }
  else if (parts[0] === "faq") { key = "faq"; pageFaq(); }
  else pageHome();
  document.querySelectorAll(".main-nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === key));
  const si = $("#searchInput");
  if (key === "shop" && params.get("q")) si.value = params.get("q");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

// ---------- Habillage (en-tête, pied de page) ----------
function renderChrome() {
  const s = state.settings;
  $("#logo").innerHTML = `${starLogo()}<span>${esc(s.storeName)}</span>`;
  const ann = tr(s, "announcement");
  $("#announce").hidden = !ann;
  $("#announce").textContent = ann;
  $("#searchToggle").innerHTML = ICONS.search;
  $("#cartBtn").insertAdjacentHTML("afterbegin", "");
  if (!$("#cartBtn svg")) $("#cartBtn").insertAdjacentHTML("afterbegin", ICONS.cart);
  $("#drawerClose").innerHTML = ICONS.x;
  const wa = `https://wa.me/${digitsOnly(s.whatsapp)}`;
  $("#waFloat").href = wa;
  $("#waFloat").innerHTML = ICONS.whatsapp;
  $("#waFloat").setAttribute("aria-label", t("wa_chat"));

  const socials = [["instagram", s.instagram], ["facebook", s.facebook], ["tiktok", s.tiktok]].filter(([, u]) => u);
  $("#footerGrid").innerHTML = `
    <div>
      <a href="#/" class="logo" style="margin-bottom:.9rem">${starLogo()}<span>${esc(s.storeName)}</span></a>
      <p style="max-width:40ch">${esc(tr(s, "heroSubtitle"))}</p>
    </div>
    <div>
      <h4>${t("nav_shop")}</h4>
      <div class="footer-links">
        ${state.categories.map((c) => `<a href="#/shop?cat=${encodeURIComponent(c.id)}">${esc(tr(c, "name"))}</a>`).join("")}
        <a href="#/faq">${t("faq_title")}</a>
      </div>
    </div>
    <div>
      <h4>${t("footer_contact")}</h4>
      <div class="footer-links">
        <a href="${wa}" target="_blank" rel="noopener" dir="ltr">WhatsApp +${esc(digitsOnly(s.whatsapp))}</a>
        ${s.email ? `<a href="mailto:${esc(s.email)}">${esc(s.email)}</a>` : ""}
      </div>
      ${socials.length ? `<h4 style="margin-top:1.2rem">${t("footer_follow")}</h4><div class="socials">${socials.map(([k, u]) => `<a class="icon-btn" href="${esc(u)}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k]}</a>`).join("")}</div>` : ""}
    </div>`;
  $("#footerBottom").innerHTML = `<span>${t("footer_rights", new Date().getFullYear(), esc(s.storeName))}</span><a href="admin.html" style="color:var(--mist-2)">Admin</a>`;

  if (state.db.mode === "demo") {
    const r = $("#demoRibbon");
    r.hidden = false;
    r.innerHTML = `Mode démo : les données sont enregistrées dans ce navigateur. <a href="admin.html">Ouvrir l'espace admin</a>`;
  }
  applyDir();
}

// ---------- Démarrage ----------
async function init() {
  applyDir();
  app.innerHTML = `<div class="wrap" style="padding-block:3rem"><div class="grid">${'<div class="skeleton" style="aspect-ratio:1"></div>'.repeat(4)}</div></div>`;
  try {
    state.db = await getDB();
    const [settings, products, categories] = await Promise.all([
      state.db.getSettings(), state.db.listProducts(), state.db.listCategories()
    ]);
    Object.assign(state, { settings, products, categories });
  } catch (e) {
    console.error(e);
    app.innerHTML = `<div class="wrap">${emptyHTML("Impossible de charger la boutique. Vérifiez votre connexion puis rechargez la page.")}</div>`;
    return;
  }
  state.cart = state.cart.filter((l) => state.products.some((p) => p.id === l.id));
  renderChrome();
  updateCartBadge();
  route();
}

// ---------- Événements globaux ----------
window.addEventListener("hashchange", route);
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add); return; }
  const inc = e.target.closest("[data-inc]");
  if (inc) { const l = state.cart.find((x) => x.id === inc.dataset.inc); setQty(inc.dataset.inc, (l?.qty || 0) + 1); return; }
  const dec = e.target.closest("[data-dec]");
  if (dec) { const l = state.cart.find((x) => x.id === dec.dataset.dec); setQty(dec.dataset.dec, (l?.qty || 0) - 1); return; }
  const rm = e.target.closest("[data-rm]");
  if (rm) { setQty(rm.dataset.rm, 0); return; }
  if (e.target.closest("[data-close]")) closeDrawer();
});
$("#cartBtn").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
$("#overlay").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#drawer").classList.contains("open")) closeDrawer(); });
$("#langBtn").addEventListener("click", () => {
  setLang(getLang() === "fr" ? "ar" : "fr");
  renderChrome(); renderDrawer(); route();
});
$("#searchToggle").addEventListener("click", () => {
  const bar = $("#searchBar");
  bar.hidden = !bar.hidden;
  if (!bar.hidden) $("#searchInput").focus();
});
$("#searchInput").addEventListener("input", debounce((e) => {
  const q = e.target.value.trim();
  location.hash = q ? `#/shop?q=${encodeURIComponent(q)}` : "#/shop";
}, 300));

init();
