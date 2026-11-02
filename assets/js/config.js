// ============================================================
//  CONFIGURATION DU SITE
// ============================================================
//  Les valeurs Firebase ci-dessous ne sont PAS secrètes : elles
//  identifient seulement votre projet. Ce qui protège vos données,
//  ce sont les règles du fichier `firestore.rules` (voir README).
// ============================================================

export const CONFIG = {
  firebase: {
    apiKey: "AIzaSyB6uVl0RmlzuiuP5xjeDws3zoyUIv36C_A",
    authDomain: "mintaraf.firebaseapp.com",
    projectId: "mintaraf",
    storageBucket: "mintaraf.firebasestorage.app",
    messagingSenderId: "202671736284",
    appId: "1:202671736284:web:7e32a8ad834e78380c3b19"
  },

  // Protection anti-robots (facultatif, recommandé) — voir README §5.
  // Collez ici la « clé de site » reCAPTCHA v3 utilisée par Firebase App Check.
  appCheckSiteKey: "",

  // Déconnexion automatique de l'admin après X minutes sans activité
  adminIdleMinutes: 30,

  defaultLang: "fr" // "fr" ou "ar"
};

export const isFirebaseConfigured = () =>
  Boolean(CONFIG.firebase && CONFIG.firebase.apiKey && CONFIG.firebase.projectId);
