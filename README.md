# Mintaraf — Support informatique à distance

Site pour commerces et petites entreprises **sans service informatique** :
le client choisit un pack, décrit son problème, et un technicien l'aide à distance
(AnyDesk ou appel vidéo) ou se déplace.

| Pack | Prix | Délai |
|---|---|---|
| Standard | 199 DH | Rappel sous 24 h (à distance) |
| Urgent | 299 DH | Prise en charge en moins de 30 min (à distance) |
| Sur site | 499 DH | Un technicien se déplace |

Tout (prix, textes FR/AR, FAQ, services, coordonnées) se modifie depuis l'admin.

```
index.html             → le site public (français + arabe)
admin.html             → l'espace administration
firestore.rules        → 🔒 règles de sécurité (à publier dans Firebase)
assets/js/config.js    → configuration Firebase
assets/js/defaults.js  → textes par défaut (avant la première modification dans l'admin)
assets/vendor/         → Firebase, hébergé localement (aucun script externe)
assets/fonts/          → polices hébergées localement
```

---

## 1. Mettre à jour le site sur GitHub

1. Sur GitHub, ouvrez le dépôt `mintaraf.github.io`.
2. **Supprimez les anciens fichiers** qui ne servent plus :
   `assets/css/style.css`, `assets/js/store.js`, `assets/js/seed.js`.
3. **Add file → Upload files** : glissez tout le contenu de ce dossier
   (y compris `.nojekyll`, `404.html`, `robots.txt`, `assets/`) → **Commit changes**.
4. **Settings → Pages** : vérifiez que **Enforce HTTPS** est coché.

> ⚠️ Faites l'étape 2 ci-dessous (publier les règles) **juste avant ou juste après**
> l'envoi des fichiers : les nouvelles règles sont nécessaires pour que les demandes
> soient enregistrées. En attendant, le site marche quand même (les demandes arrivent
> sur WhatsApp).

---

## 2. Publier les règles de sécurité (obligatoire)

Firebase Console → projet **mintaraf** → **Firestore Database → Règles** →
effacez tout, collez le contenu de **`firestore.rules`** → **Publier**.

Ces règles garantissent que :
- un visiteur peut **envoyer** une demande, mais ne peut **lire aucune** demande ;
- le prix d'une demande doit être **exactement** celui du pack (impossible de tricher) ;
- chaque champ est vérifié (type, longueur) — impossible d'envoyer n'importe quoi ;
- seuls les comptes **actifs** de l'équipe voient les demandes, selon leurs droits ;
- seul un **administrateur** gère les utilisateurs, les coordonnées et les suppressions ;
- les anciennes collections de l'ancienne boutique sont fermées.

Pour tester une règle : onglet **Règles → Terrain de jeu (Rules Playground)**.

---

## 3. Premier lancement de l'admin

Ouvrez `https://mintaraf.github.io/admin.html` et connectez-vous avec votre compte
administrateur existant. À la première connexion, les 3 packs (199 / 299 / 499 DH)
sont créés automatiquement.

S'il n'existe encore aucun compte, l'écran **Bienvenue** s'affiche une seule fois pour
créer l'administrateur principal. **Faites-le immédiatement** après la mise en ligne.

Ensuite, dans l'admin :
1. **Coordonnées** → mettez votre **numéro WhatsApp** (ex : `212612345678`) → *Tester* → *Enregistrer*.
2. **Packs et prix** → vérifiez les prix et les textes.
3. **Contenu du site** → adaptez les textes, services et questions.

### Rôles

| | Administrateur | Technicien |
|---|---|---|
| Voir les demandes | ✅ | si coché |
| Traiter les demandes (statut, notes) | ✅ | si coché |
| Modifier packs et prix | ✅ | si coché |
| Modifier les textes du site | ✅ | si coché |
| Coordonnées, utilisateurs, suppressions | ✅ | ❌ |

---

## 4. Réglages de sécurité Firebase (15 minutes, fortement recommandé)

Dans **Firebase Console → Authentication → Settings** :
- **Password policy** → *Require enforcement* ; longueur minimale **12** ;
  cochez majuscule, minuscule et chiffre.
- **User account management → Email enumeration protection** → activé.
- **Authorized domains** → gardez seulement `mintaraf.github.io`, `mintaraf.firebaseapp.com`
  (et `localhost` si vous testez sur votre PC).

Dans **Google Cloud Console → APIs & Services → Credentials** → la clé « Browser key » :
- **Application restrictions → Websites** → ajoutez `https://mintaraf.github.io/*`.

Comptes :
- Activez la **validation en deux étapes (2FA)** sur votre compte **GitHub** et sur votre
  compte **Google** (Firebase). Quiconque contrôle ces comptes contrôle le site :
  c'est la protection la plus importante de toutes.

---

## 5. Protection anti-robots (facultatif, recommandé si vous recevez du spam)

1. Firebase Console → **App Check** → enregistrez l'application web avec **reCAPTCHA v3**
   → copiez la **clé de site**.
2. Collez-la dans `assets/js/config.js` → `appCheckSiteKey: "..."`.
3. Dans `index.html` et `admin.html`, dans la ligne `Content-Security-Policy`, remplacez :
   - `script-src 'self'` par `script-src 'self' https://www.google.com https://www.gstatic.com`
   - `frame-src 'none'` par `frame-src https://www.google.com https://recaptcha.google.com`
4. Après quelques jours sans erreur, dans App Check → **Firestore → Appliquer (Enforce)**.

---

## Ce qui protège le site

- **Pas de serveur à pirater** : GitHub Pages ne sert que des fichiers statiques.
- **Les données sont protégées par les règles Firestore**, vérifiées côté Google,
  pas par le code du navigateur.
- **Aucun script externe** : Firebase et les polices sont hébergés dans le site ;
  une politique de sécurité (CSP) stricte bloque tout script venant d'ailleurs.
- **Aucun HTML saisi n'est interprété** : tous les textes (y compris ceux de l'admin et
  des clients) sont affichés comme du texte brut ; seuls les liens `https://` sont acceptés.
- **Session admin** : fermée à la fermeture du navigateur et après 30 min d'inactivité ;
  l'admin refuse de s'afficher dans un cadre (anti-clickjacking) et n'est pas indexé par Google.
- **Formulaire** : champ piège anti-robot, limite d'une demande par minute, longueurs limitées.
- **Export CSV** protégé contre l'injection de formules Excel.

---

## Tester sur votre ordinateur

```
python -m http.server 8000
```
Puis ouvrez `http://localhost:8000/?demo` (site) et `http://localhost:8000/admin.html?demo`
(admin : `admin@demo.local` / `demo-admin-2026`). Le **mode démo ne fonctionne que sur
localhost** : il est impossible de l'activer sur le vrai site.

## Mettre à jour Firebase (développeurs)

Les fichiers de `assets/vendor/` sont générés avec esbuild à partir du paquet npm
`firebase@10.14.1` (app, firestore/lite, auth, app-check).
