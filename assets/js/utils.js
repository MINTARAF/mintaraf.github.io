// Petites fonctions partagées entre le site et l'admin.
// Règle de sécurité : tout texte venant de la base passe par esc()
// avant d'être affiché. Aucun HTML saisi n'est jamais interprété.

export const esc = (s = "") =>
  String(s ?? "").replace(/[&<>"'`]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c]));

export const formatPrice = (n, currency = "DH") => {
  const v = Number(n || 0);
  return `${v.toLocaleString("fr-FR")} ${currency}`;
};

// Identifiant de demande difficile à deviner : IT-XXXXXXXX
export const ticketId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint32Array(8);
  crypto.getRandomValues(buf);
  return "IT-" + Array.from(buf, (n) => chars[n % chars.length]).join("");
};

export const slugify = (s = "") =>
  String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);

export const digitsOnly = (s = "") => String(s).replace(/\D/g, "");

// Numéro marocain → format international pour WhatsApp (06… → 2126…)
export const toIntl = (s = "") => {
  let d = digitsOnly(s);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 && d.startsWith("0")) d = "212" + d.slice(1);
  return d;
};

// N'accepte que les liens https:// (bloque javascript:, data:, etc.)
export const safeUrl = (u = "") => {
  try {
    const url = new URL(String(u).trim());
    return url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
};

export const lines = (s = "") => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);

export const clip = (s = "", max = 200) => String(s ?? "").trim().slice(0, max);

export const debounce = (fn, ms = 250) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

// Date Firestore (Timestamp) ou nombre → Date
export const toDate = (v) => {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate();
  if (typeof v === "number") return new Date(v);
  if (v.seconds) return new Date(v.seconds * 1000);
  return null;
};
export const toMillis = (v) => toDate(v)?.getTime() || 0;

export const fmtDate = (v, lang = "fr") => {
  const d = toDate(v);
  if (!d) return "—";
  return d.toLocaleString(lang === "ar" ? "ar-MA" : "fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

export const timeAgo = (v) => {
  const d = toDate(v);
  if (!d) return "—";
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 7) return `il y a ${Math.floor(s / 86400)} j`;
  return fmtDate(d);
};

// Stockage navigateur qui ne plante jamais (navigation privée, etc.)
const mem = {};
export const store = {
  get(k, fallback = null) {
    try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); }
    catch { return k in mem ? mem[k] : fallback; }
  },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; } },
  remove(k) { try { localStorage.removeItem(k); } catch { delete mem[k]; } }
};
