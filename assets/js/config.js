// ============================================================
//  CONFIGURATION DU SITE
// ============================================================
//  1) Mode démo : laissez `firebase` vide → tout est stocké dans
//     le navigateur (parfait pour tester). Compte démo :
//        admin@demo.com  /  admin123
//
//  2) Mode production : créez un projet Firebase (gratuit) et
//     collez ici la config "Web app" (voir README.md).
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

  // Valeurs par défaut (modifiables ensuite depuis l'admin → Paramètres)
  defaults: {
    storeName: "Mintaraf",
    whatsapp: "212600000000",      // format international, sans + ni espaces
    currency: "DH",
    defaultLang: "fr"              // "fr" ou "ar"
  }
};

export const isFirebaseConfigured = () =>
  Boolean(CONFIG.firebase && CONFIG.firebase.apiKey && CONFIG.firebase.projectId);
