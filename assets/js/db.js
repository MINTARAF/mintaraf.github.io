// ============================================================
//  Couche de données : une seule API, deux moteurs
//   - "firebase" : Firebase Auth + Firestore (le vrai site)
//   - "demo"     : navigateur uniquement, activé SEULEMENT en local
//                  (http://localhost:8000/?demo) pour tester.
// ============================================================
import { CONFIG, isFirebaseConfigured } from "./config.js";
import { store, toMillis } from "./utils.js";
import { DEFAULT_SETTINGS, DEFAULT_CONTENT, DEFAULT_PACKS } from "./defaults.js";

export const PERMISSIONS = [
  { key: "requests.view", label: "Voir les demandes des clients" },
  { key: "requests.manage", label: "Traiter les demandes (statut, notes)" },
  { key: "packs.edit", label: "Modifier les packs et les prix" },
  { key: "content.edit", label: "Modifier les textes du site" }
];

export const STATUSES = [
  { key: "new", label: "Nouvelle" },
  { key: "progress", label: "En cours" },
  { key: "done", label: "Résolue" },
  { key: "cancelled", label: "Annulée" }
];

export const can = (user, perm) => {
  if (!user || user.active !== true) return false;
  if (user.role === "admin") return true;
  return Array.isArray(user.permissions) && user.permissions.includes(perm);
};
export const isAdmin = (user) => Boolean(user && user.active === true && user.role === "admin");

const byNewest = (a, b) => toMillis(b.createdAt) - toMillis(a.createdAt);
const byOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);
const clean = (o) => JSON.parse(JSON.stringify(o)); // retire les undefined
const withDefaults = (packs) => (packs.length ? packs : DEFAULT_PACKS.map((p) => ({ ...p, _default: true }))).sort(byOrder);

const LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const DEMO = LOCAL && (new URLSearchParams(location.search).has("demo") || !isFirebaseConfigured());

// ------------------------------------------------------------
//  MOTEUR DÉMO (local uniquement — jamais en ligne)
// ------------------------------------------------------------
function demoBackend() {
  const K = { s: "demo_settings", c: "demo_content", p: "demo_packs", r: "demo_requests", u: "demo_users", sess: "demo_session" };
  if (!store.get(K.u)) store.set(K.u, [
    { uid: "admin-demo", name: "Admin démo", email: "admin@demo.local", password: "demo-admin-2026", role: "admin", permissions: [], active: true, createdAt: Date.now() },
    { uid: "tech-demo", name: "Technicien démo", email: "tech@demo.local", password: "demo-tech-2026", role: "tech", permissions: ["requests.view", "requests.manage"], active: true, createdAt: Date.now() }
  ]);
  const listeners = new Set();
  const pub = (u) => { if (!u) return null; const { password, ...rest } = u; return rest; };
  const current = () => {
    const u = store.get(K.u, []).find((x) => x.uid === store.get(K.sess));
    return u && u.active ? pub(u) : null;
  };
  const emit = () => listeners.forEach((cb) => cb(current()));
  const need = (ok) => { if (!ok) throw new Error("Permission refusée."); };
  const upsert = (key, item, idf = "id") => {
    const list = store.get(key, []);
    const i = list.findIndex((x) => x[idf] === item[idf]);
    if (i >= 0) list[i] = { ...list[i], ...item }; else list.push(item);
    store.set(key, list);
  };
  const rm = (key, id, idf = "id") => store.set(key, store.get(key, []).filter((x) => x[idf] !== id));

  return {
    mode: "demo",
    async getSettings() { return { ...DEFAULT_SETTINGS, ...store.get(K.s, {}) }; },
    async getContent() { return { ...DEFAULT_CONTENT, ...store.get(K.c, {}) }; },
    async listPacks({ all = false } = {}) {
      const list = store.get(K.p, []);
      return all ? list.sort(byOrder) : withDefaults(list.filter((p) => p.active));
    },
    async createRequest(r) {
      const list = store.get(K.r, []);
      if (list.some((x) => x.id === r.id)) throw new Error("Demande déjà existante.");
      list.push({ ...clean(r), createdAt: Date.now() }); store.set(K.r, list);
    },
    async listRequests() { need(can(current(), "requests.view")); return store.get(K.r, []).sort(byNewest); },
    async updateRequest(id, patch) { need(can(current(), "requests.manage")); upsert(K.r, { id, ...clean(patch), updatedAt: Date.now() }); },
    async deleteRequest(id) { need(isAdmin(current())); rm(K.r, id); },
    async savePack(p) { need(can(current(), "packs.edit")); upsert(K.p, clean(p)); },
    async deletePack(id) { need(isAdmin(current())); rm(K.p, id); },
    async seedPacks() { need(can(current(), "packs.edit")); if (!store.get(K.p, []).length) store.set(K.p, DEFAULT_PACKS); },
    async saveSettings(s) { need(isAdmin(current())); store.set(K.s, { ...store.get(K.s, {}), ...clean(s) }); },
    async saveContent(c) { need(can(current(), "content.edit")); store.set(K.c, { ...store.get(K.c, {}), ...clean(c) }); },

    onAuth(cb) { listeners.add(cb); setTimeout(() => cb(current())); return () => listeners.delete(cb); },
    async signIn(email, password) {
      const u = store.get(K.u, []).find((x) => x.email === email.trim().toLowerCase());
      if (!u || u.password !== password) throw new Error("Email ou mot de passe incorrect.");
      if (!u.active) throw new Error("Ce compte est désactivé.");
      store.set(K.sess, u.uid); emit();
    },
    async signOut() { store.remove(K.sess); emit(); },
    async resetPassword() { throw new Error("Indisponible en mode démo."); },
    async changePassword() { throw new Error("Indisponible en mode démo."); },
    async needsSetup() { return false; },
    async setupAdmin() {},
    async listUsers() { need(isAdmin(current())); return store.get(K.u, []).map(pub).sort(byNewest); },
    async createUser(u) {
      need(isAdmin(current()));
      const list = store.get(K.u, []);
      if (list.some((x) => x.email === u.email.toLowerCase())) throw new Error("Cet email est déjà utilisé.");
      list.push({ ...u, email: u.email.toLowerCase(), uid: "u-" + Date.now(), createdAt: Date.now() });
      store.set(K.u, list);
    },
    async updateUser(id, patch) { need(isAdmin(current())); upsert(K.u, { uid: id, ...clean(patch) }, "uid"); emit(); },
    async deleteUser(id) { need(isAdmin(current())); if (id === current()?.uid) throw new Error("Vous ne pouvez pas supprimer votre propre compte."); rm(K.u, id, "uid"); }
  };
}

// ------------------------------------------------------------
//  MOTEUR FIREBASE (Firebase est hébergé dans assets/vendor :
//  aucun script externe n'est chargé)
// ------------------------------------------------------------
async function firebaseBackend() {
  const F = await import("../vendor/fb-data.js");
  const app = F.initializeApp(CONFIG.firebase);

  if (CONFIG.appCheckSiteKey) {
    try {
      const AC = await import("../vendor/fb-appcheck.js");
      AC.initializeAppCheck(app, { provider: new AC.ReCaptchaV3Provider(CONFIG.appCheckSiteKey), isTokenAutoRefreshEnabled: true });
    } catch (e) { console.warn("App Check non initialisé", e); }
  }

  const db = F.getFirestore(app);
  const { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, writeBatch, serverTimestamp } = F;
  const all = async (q) => (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));

  let A = null, auth = null, profile = null;
  const loadAuth = async () => {
    if (auth) return;
    A = await import("../vendor/fb-auth.js");
    auth = A.initializeAuth(app, { persistence: A.browserSessionPersistence });
  };
  const loadProfile = async (user) => {
    if (!user) return null;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return { uid: user.uid, email: user.email, role: "none", permissions: [], active: false, noProfile: true };
    return { uid: user.uid, ...snap.data(), email: user.email };
  };

  const friendly = (e) => {
    const code = e?.code || "";
    const map = {
      "auth/invalid-credential": "Email ou mot de passe incorrect.",
      "auth/wrong-password": "Email ou mot de passe incorrect.",
      "auth/user-not-found": "Email ou mot de passe incorrect.",
      "auth/invalid-email": "Adresse email invalide.",
      "auth/email-already-in-use": "Cet email est déjà utilisé.",
      "auth/weak-password": "Mot de passe trop faible.",
      "auth/password-does-not-meet-requirements": "Le mot de passe ne respecte pas les règles de sécurité (longueur, majuscule, chiffre…).",
      "auth/too-many-requests": "Trop de tentatives. Réessayez dans quelques minutes.",
      "auth/requires-recent-login": "Par sécurité, reconnectez-vous puis réessayez.",
      "auth/network-request-failed": "Connexion internet impossible.",
      "permission-denied": "Permission refusée.",
      "unavailable": "Service momentanément indisponible. Vérifiez votre connexion."
    };
    return new Error(map[code] || e?.message || "Erreur inconnue.");
  };
  const wrap = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { throw friendly(e); } };

  return {
    mode: "firebase",
    getSettings: wrap(async () => {
      const s = await getDoc(doc(db, "settings", "site"));
      return { ...DEFAULT_SETTINGS, ...(s.exists() ? s.data() : {}) };
    }),
    getContent: wrap(async () => {
      const s = await getDoc(doc(db, "settings", "content"));
      return { ...DEFAULT_CONTENT, ...(s.exists() ? s.data() : {}) };
    }),
    listPacks: wrap(async ({ all: everything = false } = {}) => {
      if (everything) return (await all(collection(db, "packs"))).sort(byOrder);
      return withDefaults(await all(query(collection(db, "packs"), where("active", "==", true))));
    }),
    createRequest: wrap(async (r) => setDoc(doc(db, "requests", r.id), { ...clean(r), createdAt: serverTimestamp() })),
    listRequests: wrap(async () => (await all(collection(db, "requests"))).sort(byNewest)),
    updateRequest: wrap(async (id, patch) => updateDoc(doc(db, "requests", id), { ...clean(patch), updatedAt: serverTimestamp(), updatedBy: profile?.uid || "" })),
    deleteRequest: wrap(async (id) => deleteDoc(doc(db, "requests", id))),
    savePack: wrap(async (p) => setDoc(doc(db, "packs", p.id), clean(p))),
    deletePack: wrap(async (id) => deleteDoc(doc(db, "packs", id))),
    seedPacks: wrap(async () => {
      const existing = await getDocs(collection(db, "packs"));
      if (!existing.empty) return;
      const b = writeBatch(db);
      DEFAULT_PACKS.forEach((p) => b.set(doc(db, "packs", p.id), p));
      await b.commit();
    }),
    saveSettings: wrap(async (s) => setDoc(doc(db, "settings", "site"), clean(s), { merge: true })),
    saveContent: wrap(async (c) => setDoc(doc(db, "settings", "content"), clean(c), { merge: true })),

    // --- Authentification (chargée seulement dans l'admin) ---
    onAuth(cb) {
      let unsub = () => {};
      loadAuth().then(() => {
        unsub = A.onAuthStateChanged(auth, async (user) => {
          try { profile = await loadProfile(user); }
          catch { profile = user ? { uid: user.uid, email: user.email, noProfile: true, active: false } : null; }
          cb(profile);
        });
      }).catch(() => cb(null));
      return () => unsub();
    },
    signIn: wrap(async (email, password) => { await loadAuth(); await A.signInWithEmailAndPassword(auth, email.trim(), password); }),
    signOut: wrap(async () => { await loadAuth(); await A.signOut(auth); }),
    resetPassword: wrap(async (email) => { await loadAuth(); await A.sendPasswordResetEmail(auth, email.trim()); }),
    changePassword: wrap(async (current, next) => {
      await loadAuth();
      const u = auth.currentUser;
      if (!u) throw new Error("Non connecté.");
      await A.reauthenticateWithCredential(u, A.EmailAuthProvider.credential(u.email, current));
      await A.updatePassword(u, next);
    }),

    // Premier lancement : créer le compte administrateur principal
    needsSetup: wrap(async () => !(await getDoc(doc(db, "meta", "setup"))).exists()),
    setupAdmin: wrap(async ({ name, email, password }) => {
      await loadAuth();
      let cred;
      try { cred = await A.createUserWithEmailAndPassword(auth, email.trim(), password); }
      catch (e) {
        if (e.code === "auth/email-already-in-use") cred = await A.signInWithEmailAndPassword(auth, email.trim(), password);
        else throw e;
      }
      const u = cred.user;
      await A.updateProfile(u, { displayName: name }).catch(() => {});
      const b = writeBatch(db);
      b.set(doc(db, "users", u.uid), { name, email: u.email, role: "admin", permissions: [], active: true, createdAt: Date.now() });
      b.set(doc(db, "meta", "setup"), { done: true, by: u.uid, at: Date.now() });
      await b.commit();
      profile = await loadProfile(u);
    }),

    // --- Utilisateurs (administrateur uniquement, garanti par les règles) ---
    listUsers: wrap(async () => (await all(collection(db, "users"))).map((u) => ({ uid: u.id, ...u })).sort(byNewest)),
    createUser: wrap(async ({ name, email, password, role, permissions, active }) => {
      // Une 2e instance évite de déconnecter l'administrateur
      await loadAuth();
      const sec = F.initializeApp(CONFIG.firebase, "secondary-" + Date.now());
      try {
        const secAuth = A.initializeAuth(sec, { persistence: A.inMemoryPersistence });
        const cred = await A.createUserWithEmailAndPassword(secAuth, email.trim(), password);
        await setDoc(doc(db, "users", cred.user.uid), clean({ name, email: cred.user.email, role, permissions, active, createdAt: Date.now() }));
        await A.signOut(secAuth);
      } finally { await F.deleteApp(sec).catch(() => {}); }
    }),
    updateUser: wrap(async (id, patch) => updateDoc(doc(db, "users", id), clean(patch))),
    deleteUser: wrap(async (id) => {
      if (id === profile?.uid) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
      await deleteDoc(doc(db, "users", id));
    })
  };
}

// ------------------------------------------------------------
let _db = null;
export async function getDB() {
  if (_db) return _db;
  _db = DEMO ? demoBackend() : await firebaseBackend();
  return _db;
}
