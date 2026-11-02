// Petites fonctions partagées entre la boutique et l'admin

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const formatPrice = (n, currency = "DH") => {
  const v = Number(n || 0);
  const s = v % 1 === 0 ? v.toLocaleString("fr-FR") : v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${s} ${currency}`;
};

export const uid = (prefix = "") =>
  prefix + Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 8);

export const orderId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "CMD-" + s;
};

export const slugify = (s = "") =>
  s.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

export const hueFrom = (str = "") => {
  let h = 0;
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
};

// Points d'une étoile à 8 branches (khatam) centrée en (cx, cy)
export const khatamPoints = (cx, cy, R) => {
  const r = R * 0.7654;
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
};

// Couverture générée quand un produit n'a pas d'image
export const coverArt = (seed = "", label = "") => {
  const h = hueFrom(seed);
  const letter = esc((label || seed || "?").trim().charAt(0).toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${h},48%,26%)"/><stop offset="1" stop-color="hsl(${(h + 40) % 360},55%,12%)"/></linearGradient></defs>
<rect width="600" height="600" fill="url(#g)"/>
<polygon points="${khatamPoints(300, 300, 250)}" fill="none" stroke="#E9B44C" stroke-opacity=".35" stroke-width="3"/>
<polygon points="${khatamPoints(300, 300, 185)}" fill="none" stroke="#E9B44C" stroke-opacity=".6" stroke-width="2"/>
<polygon points="${khatamPoints(300, 300, 120)}" fill="#E9B44C" fill-opacity=".12"/>
<text x="300" y="340" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="130" fill="#F6E7C8">${letter}</text>
</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

export const productImage = (p) => (p && p.image) || coverArt(p?.id || p?.title_fr || "", p?.title_fr || "");

// Redimensionne et compresse une image choisie par l'admin → data URL (stockée avec le produit)
export const compressImage = (file, max = 900, quality = 0.82) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) return reject(new Error("Fichier non image"));
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image illisible"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        let q = quality, out = c.toDataURL("image/jpeg", q);
        while (out.length > 300_000 && q > 0.4) { q -= 0.1; out = c.toDataURL("image/jpeg", q); }
        resolve(out);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export const debounce = (fn, ms = 250) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

export const digitsOnly = (s = "") => String(s).replace(/\D/g, "");

// Stockage navigateur sécurisé (ne plante jamais)
const mem = {};
export const store = {
  get(k, fallback = null) {
    try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); }
    catch { return k in mem ? mem[k] : fallback; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; }
  },
  remove(k) { try { localStorage.removeItem(k); } catch { delete mem[k]; } }
};
