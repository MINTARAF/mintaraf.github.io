// ============================================================
//  Couche de données : une seule API, deux moteurs
//   - "demo"     : localStorage (aucune configuration)
//   - "firebase" : Firebase Auth + Firestore (production)
// ============================================================
import { CONFIG, isFirebaseConfigured } from "./config.js";
import { store, uid } from "./utils.js";
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_SETTINGS } from "./seed.js";

export const PERMISSIONS = [
  { key: "products.create", label: "Ajouter des produits" },
  { key: "products.edit", label: "Modifier les produits" },
  { key: "products.delete", label: "Supprimer des produits" },
  { key: "categories.manage", label: "Gérer les catégories" },
  { key: "orders.view", label: "Voir les commandes" },
  { key: "orders.manage", label: "Changer le statut des commandes" }
];

export const ORDER_STATUSES = [
  { key: "new", label: "Nouvelle" },
  { key: "confirmed", label: "Confirmée" },
  { key: "delivered", label: "Livrée" },
  { key: "cancelled", label: "Annulée" }
];

export const can = (user, perm) => {
  if (!user || user.active === false) return false;
  if (user.role === "admin") return true;
  return Array.isArray(user.permissions) && user.permissions.includes(perm);
};

const byNewest = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);
const byOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);
const clean = (o) => JSON.parse(JSON.stringify(o)); // retire les undefined

// ------------------------------------------------------------
//  MOTEUR DÉMO (localStorage)
// ------------------------------------------------------------
function demoBackend() {
  const K = { p: "ds_products", c: "ds_categories", s: "ds_settings", o: "ds_orders", u: "ds_users", sess: "ds_session" };
  if (!store.get(K.p)) store.set(K.p, SEED_PRODUCTS);
  if (!store.get(K.c)) store.set(K.c, SEED_CATEGORIES);
  if (!store.get(K.s)) store.set(K.s, { ...SEED_SETTINGS, ...CONFIG.defaults });
  if (!store.get(K.o)) store.set(K.o, []);
  if (!store.get(K.u)) store.set(K.u, [
    { uid: "admin-demo", name: "Administrateur", email: "admin@demo.com", password: "admin123", role: "admin", permissions: [], active: true, createdAt: Date.now() },
    { uid: "staff-demo", name: "Employé démo", email: "staff@demo.com", password: "staff123", role: "staff", permissions: ["products.create", "orders.view"], active: true, createdAt: Date.now() }
  ]);

  const listeners = new Set();
  const publicUser = (u) => { if (!u) return null; const { password, ...rest } = u; return rest; };
  const current = () => {
    const id = store.get(K.sess);
    const u = (store.get(K.u) || []).find((x) => x.uid === id);
    return u && u.active !== false ? publicUser(u) : null;
  };
  const emit = () => listeners.forEach((cb) => cb(current()));
  const upsert = (key, item, idField = "id") => {
    const list = store.get(key, []);
    const i = list.findIndex((x) => x[idField] === item[idField]);
    if (i >= 0) list[i] = { ...list[i], ...item }; else list.push(item);
    store.set(key, list);
    return item[idField];
  };
  const removeFrom = (key, id, idField = "id") => store.set(key, store.get(key, []).filter((x) => x[idField] !== id));
  const requirePerm = (perm) => { if (!can(current(), perm)) throw new Error("Permission refusée"); };

  return {
    mode: "demo",
    async listProducts({ all = false } = {}) {
      const list = store.get(K.p, []);
      return (all ? list : list.filter((p) => p.published)).sort(byNewest);
    },
    async getProduct(id) { return store.get(K.p, []).find((p) => p.id === id) || null; },
    async saveProduct(p) {
      const existing = p.id ? store.get(K.p, []).find((x) => x.id === p.id) : null;
      const isNew = !existing;
      const me = current();
      const ownDraft = existing && existing.createdBy === me?.uid && can(me, "products.create");
      if (!ownDraft) requirePerm(isNew ? "products.create" : "products.edit");
      const item = { ...p, id: p.id || uid("p-"), updatedAt: Date.now() };
      if (isNew) item.createdAt = item.createdAt || Date.now();
      return upsert(K.p, clean(item));
    },
    async deleteProduct(id) { requirePerm("products.delete"); removeFrom(K.p, id); },

    async listCategories() { return store.get(K.c, []).sort(byOrder); },
    async saveCategory(c) { requirePerm("categories.manage"); return upsert(K.c, clean({ ...c, id: c.id || uid("c-") })); },
    async deleteCategory(id) { requirePerm("categories.manage"); removeFrom(K.c, id); },

    async getSettings() { return { ...CONFIG.defaults, ...store.get(K.s, {}) }; },
    async saveSettings(s) {
      if (current()?.role !== "admin") throw new Error("Permission refusée");
      store.set(K.s, { ...store.get(K.s, {}), ...clean(s) });
    },

    async createOrder(o) { const list = store.get(K.o, []); list.push(clean(o)); store.set(K.o, list); return o.id; },
    async listOrders() { requirePerm("orders.view"); return store.get(K.o, []).sort(byNewest); },
    async updateOrder(id, patch) { requirePerm("orders.manage"); upsert(K.o, { id, ...patch }); },
    async deleteOrder(id) { if (current()?.role !== "admin") throw new Error("Permission refusée"); removeFrom(K.o, id); },

    // --- Authentification ---
    onAuth(cb) { listeners.add(cb); cb(current()); return () => listeners.delete(cb); },
    async signIn(email, password) {
      const u = store.get(K.u, []).find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!u || u.password !== password) throw new Error("Email ou mot de passe incorrect.");
      if (u.active === false) throw new Error("Ce compte est désactivé. Contactez l'administrateur.");
      store.set(K.sess, u.uid); emit();
    },
    async signOut() { store.remove(K.sess); emit(); },
    async resetPassword() { throw new Error("En mode démo, l'administrateur modifie les mots de passe depuis Utilisateurs."); },
    async needsSetup() { return false; },
    async setupAdmin() {},

    // --- Utilisateurs (admin uniquement) ---
    async listUsers() {
      if (current()?.role !== "admin") throw new Error("Permission refusée");
      return store.get(K.u, []).map(publicUser).sort(byNewest);
    },
    async createUser({ name, email, password, role, permissions, active }) {
      if (current()?.role !== "admin") throw new Error("Permission refusée");
      const list = store.get(K.u, []);
      if (list.some((x) => x.email.toLowerCase() === email.toLowerCase())) throw new Error("Cet email est déjà utilisé.");
      if (!password || password.length < 6) throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
      list.push({ uid: uid("u-"), name, email, password, role, permissions, active, createdAt: Date.now() });
      store.set(K.u, list);
    },
    async updateUser(id, patch) {
      if (current()?.role !== "admin") throw new Error("Permission refusée");
      if (patch.password !== undefined && patch.password !== "" && patch.password.length < 6) throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
      if (patch.password === "") delete patch.password;
      upsert(K.u, { uid: id, ...patch }, "uid");
      emit();
    },
    async deleteUser(id) {
      if (current()?.role !== "admin") throw new Error("Permission refusée");
      if (id === current()?.uid) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
      removeFrom(K.u, id, "uid");
    },
    async resetDemo() {
      Object.values(K).forEach((k) => store.remove(k));
      location.reload();
    }
  };
}

// ------------------------------------------------------------
//  MOTEUR FIREBASE
// ------------------------------------------------------------
const FB = "https://www.gstatic.com/firebasejs/10.12.2/";

async function firebaseBackend() {
  const [{ initializeApp, deleteApp }, authMod, fs] = await Promise.all([
    import(FB + "firebase-app.js"),
    import(FB + "firebase-auth.js"),
    import(FB + "firebase-firestore.js")
  ]);
  const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } = authMod;
  const { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, writeBatch } = fs;

  const app = initializeApp(CONFIG.firebase);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let profile = null;

  const all = async (q) => (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
  const loadProfile = async (user) => {
    if (!user) return null;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return { uid: user.uid, email: user.email, role: "none", permissions: [], active: false, noProfile: true };
    return { uid: user.uid, email: user.email, ...snap.data() };
  };
  const friendly = (e) => {
    const code = e?.code || "";
    const map = {
      "auth/invalid-credential": "Email ou mot de passe incorrect.",
      "auth/wrong-password": "Email ou mot de passe incorrect.",
      "auth/user-not-found": "Email ou mot de passe incorrect.",
      "auth/invalid-email": "Adresse email invalide.",
      "auth/email-already-in-use": "Cet email est déjà utilisé.",
      "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
      "auth/too-many-requests": "Trop de tentatives. Réessayez dans quelques minutes.",
      "permission-denied": "Permission refusée.",
      "auth/network-request-failed": "Connexion internet impossible."
    };
    return new Error(map[code] || e?.message || "Erreur inconnue.");
  };
  const wrap = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { throw friendly(e); } };

  return {
    mode: "firebase",
    listProducts: wrap(async ({ all: everything = false } = {}) => {
      const q = everything ? collection(db, "products") : query(collection(db, "products"), where("published", "==", true));
      return (await all(q)).sort(byNewest);
    }),
    getProduct: wrap(async (id) => {
      try { const s = await getDoc(doc(db, "products", id)); return s.exists() ? { id: s.id, ...s.data() } : null; }
      catch (e) { if (e.code === "permission-denied") return null; throw e; }
    }),
    saveProduct: wrap(async (p) => {
      const id = p.id || uid("p-");
      const ref = doc(db, "products", id);
      const exists = p.id ? (await getDoc(ref)).exists() : false;
      const data = clean({ ...p, id, updatedAt: Date.now(), ...(exists ? {} : { createdAt: p.createdAt || Date.now() }) });
      await setDoc(ref, data, { merge: true });
      return id;
    }),
    deleteProduct: wrap(async (id) => deleteDoc(doc(db, "products", id))),

    listCategories: wrap(async () => (await all(collection(db, "categories"))).sort(byOrder)),
    saveCategory: wrap(async (c) => { const id = c.id || uid("c-"); await setDoc(doc(db, "categories", id), clean({ ...c, id }), { merge: true }); return id; }),
    deleteCategory: wrap(async (id) => deleteDoc(doc(db, "categories", id))),

    getSettings: wrap(async () => {
      const s = await getDoc(doc(db, "settings", "store"));
      return { ...SEED_SETTINGS, ...CONFIG.defaults, ...(s.exists() ? s.data() : {}) };
    }),
    saveSettings: wrap(async (s) => setDoc(doc(db, "settings", "store"), clean(s), { merge: true })),

    createOrder: wrap(async (o) => { await setDoc(doc(db, "orders", o.id), clean(o)); return o.id; }),
    listOrders: wrap(async () => (await all(collection(db, "orders"))).sort(byNewest)),
    updateOrder: wrap(async (id, patch) => updateDoc(doc(db, "orders", id), clean(patch))),
    deleteOrder: wrap(async (id) => deleteDoc(doc(db, "orders", id))),

    onAuth(cb) {
      return onAuthStateChanged(auth, async (user) => {
        try { profile = await loadProfile(user); } catch { profile = user ? { uid: user.uid, email: user.email, noProfile: true, active: false } : null; }
        cb(profile);
      });
    },
    signIn: wrap(async (email, password) => { await signInWithEmailAndPassword(auth, email.trim(), password); }),
    signOut: wrap(async () => signOut(auth)),
    resetPassword: wrap(async (email) => sendPasswordResetEmail(auth, email.trim())),

    // Premier lancement : créer le compte administrateur principal
    needsSetup: wrap(async () => !(await getDoc(doc(db, "meta", "setup"))).exists()),
    setupAdmin: wrap(async ({ name, email, password }) => {
      let cred;
      try { cred = await createUserWithEmailAndPassword(auth, email.trim(), password); }
      catch (e) {
        if (e.code === "auth/email-already-in-use") cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        else throw e;
      }
      const u = cred.user;
      await updateProfile(u, { displayName: name }).catch(() => {});
      const batch = writeBatch(db);
      batch.set(doc(db, "users", u.uid), { name, email: u.email, role: "admin", permissions: [], active: true, createdAt: Date.now() });
      batch.set(doc(db, "meta", "setup"), { done: true, by: u.uid, at: Date.now() });
      await batch.commit();
      profile = await loadProfile(u);
    }),

    listUsers: wrap(async () => (await all(collection(db, "users"))).map((u) => ({ uid: u.id, ...u })).sort(byNewest)),
    createUser: wrap(async ({ name, email, password, role, permissions, active }) => {
      // Une 2e instance Firebase évite de déconnecter l'administrateur
      const sec = initializeApp(CONFIG.firebase, "secondary-" + Date.now());
      try {
        const secAuth = getAuth(sec);
        const cred = await createUserWithEmailAndPassword(secAuth, email.trim(), password);
        await setDoc(doc(db, "users", cred.user.uid), clean({ name, email: cred.user.email, role, permissions, active, createdAt: Date.now() }));
        await signOut(secAuth);
      } finally { await deleteApp(sec).catch(() => {}); }
    }),
    updateUser: wrap(async (id, patch) => {
      const { password, ...rest } = patch;
      await updateDoc(doc(db, "users", id), clean(rest));
    }),
    deleteUser: wrap(async (id) => {
      if (id === profile?.uid) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
      await deleteDoc(doc(db, "users", id));
    }),
    async resetDemo() {}
  };
}

// ------------------------------------------------------------
let _db = null;
export async function getDB() {
  if (_db) return _db;
  _db = isFirebaseConfigured() ? await firebaseBackend() : demoBackend();
  return _db;
}
