# Najma Digital — Boutique de produits digitaux

Site e-commerce professionnel (français + arabe) pour vendre des produits digitaux.
Le client ajoute ses produits au panier, remplit ses infos, et la commande s'ouvre
directement dans **WhatsApp** avec un message automatique contenant tous les détails.

```
index.html          → la boutique (clients)
admin.html          → l'espace administration
assets/js/config.js → ⚙️ la seule configuration à modifier
assets/js/i18n.js   → tous les textes FR / AR de la boutique
firestore.rules     → règles de sécurité (permissions admin / utilisateur)
```

---

## 1. Tester tout de suite (mode démo)

Sans rien configurer, le site marche en **mode démo** : les données sont gardées dans
le navigateur. Parfait pour voir le rendu.

- Boutique : `index.html`
- Admin : `admin.html`
  - Administrateur : `admin@demo.com` / `admin123`
  - Utilisateur : `staff@demo.com` / `staff123`

> Les modules JavaScript ne marchent pas en double-cliquant sur le fichier.
> Lancez un petit serveur dans le dossier : `python -m http.server 8000`
> puis ouvrez http://localhost:8000 — ou mettez-le directement sur GitHub (étape 3).

⚠️ En mode démo, chaque navigateur a ses propres données. Pour un vrai site, faites l'étape 2.

---

## 2. Passer en production avec Firebase (gratuit)

GitHub Pages héberge seulement des fichiers. Pour les **comptes** (admin / utilisateur)
et pour que les **produits soient les mêmes pour tous les clients**, on utilise Firebase
(offre gratuite « Spark », largement suffisante pour démarrer).

1. Allez sur https://console.firebase.google.com → **Ajouter un projet** (Google Analytics : pas nécessaire).
2. Dans le projet : icône **`</>`** (Web) → donnez un nom → **Enregistrer l'application**.
   Firebase affiche un bloc `firebaseConfig = { apiKey: ..., ... }`.
3. Copiez ces valeurs dans **`assets/js/config.js`** (bloc `firebase`).
4. Menu **Authentication** → *Commencer* → onglet *Sign-in method* → activez **Adresse e-mail/Mot de passe**.
5. Menu **Firestore Database** → *Créer une base de données* → mode **production** →
   région `eur3 (europe-west)` (la plus proche du Maroc).
6. Firestore → onglet **Règles** → effacez tout, collez le contenu de **`firestore.rules`** → **Publier**.
7. Authentication → **Paramètres** → *Domaines autorisés* → ajoutez `VOTRE-PSEUDO.github.io`.

> La clé `apiKey` visible dans le code est **normale** avec Firebase : ce sont les
> règles (`firestore.rules`) qui protègent vos données. Même si quelqu'un modifie le code
> du site, il ne peut rien faire sans les permissions données par l'administrateur.

---

## 3. Mettre le site en ligne sur GitHub Pages

1. Créez un compte sur https://github.com puis **New repository** (ex : `boutique`), en *Public*.
2. **Add file → Upload files** : glissez **tout le contenu** du dossier
   (`index.html`, `admin.html`, `assets/`, `.nojekyll`, etc.) → **Commit changes**.
3. **Settings → Pages** → *Source* : **Deploy from a branch** → branche `main`, dossier `/ (root)` → **Save**.
4. Après 1–2 minutes, le site est en ligne : `https://VOTRE-PSEUDO.github.io/boutique/`
   - Admin : `https://VOTRE-PSEUDO.github.io/boutique/admin.html`

Pour modifier un fichier plus tard : ouvrez-le sur GitHub → icône crayon → *Commit*.

Nom de domaine perso (ex : `najma.ma`) : *Settings → Pages → Custom domain*.

---

## 4. Premier lancement

1. Ouvrez `admin.html` → l'écran **Bienvenue** apparaît → créez le **compte administrateur principal**.
   (Cet écran n'apparaît qu'une seule fois.)
2. **Paramètres** → mettez votre **numéro WhatsApp** au format international sans `+`
   (ex : `0612345678` → `212612345678`) → *Tester le numéro* → *Enregistrer*.
3. **Produits** → *Ajouter* (ou *Paramètres → Charger les produits d'exemple* pour voir le rendu).

---

## 5. Comptes et permissions

| | Administrateur | Utilisateur |
|---|---|---|
| Tableau de bord | ✅ | ✅ |
| Ajouter des produits | ✅ | si coché |
| Modifier les produits | ✅ | si coché (sinon seulement ceux qu'il a créés) |
| Supprimer des produits | ✅ | si coché |
| Gérer les catégories | ✅ | si coché |
| Voir les commandes | ✅ | si coché |
| Changer le statut des commandes | ✅ | si coché |
| Gérer les utilisateurs | ✅ | ❌ |
| Paramètres de la boutique | ✅ | ❌ |
| Supprimer des commandes | ✅ | ❌ |

Création d'un compte : **Utilisateurs → Ajouter** → nom, email, mot de passe, type de compte,
cochez les accès. Vous pouvez **désactiver** un compte à tout moment sans le supprimer.

Mot de passe oublié : bouton sur l'écran de connexion (email automatique de Firebase).

---

## 6. Le message WhatsApp

Quand le client clique sur *Envoyer la commande sur WhatsApp*, WhatsApp s'ouvre avec :

```
🛒 *Nouvelle commande* — CMD-7KQ2XA
🏪 Najma Digital
━━━━━━━━━━━━
👤 Nom : Youssef Alami
📱 Téléphone : 0612345678
📧 Email : y@exemple.ma
━━━━━━━━━━━━
📦 *Produits :*
1. Formation e-commerce au Maroc × 1 = 299 DH
2. Pack 300 templates Instagram × 1 = 149 DH
━━━━━━━━━━━━
💰 *Total : 448 DH*

Merci de confirmer ma commande.
```

La commande est aussi enregistrée dans **Admin → Commandes** (statuts : Nouvelle,
Confirmée, Livrée, Annulée), avec un bouton pour écrire au client sur WhatsApp.
Le message est en arabe si le client navigue en arabe.

---

## 7. Personnaliser

- **Nom, numéro, textes d'accueil, bandeau, réseaux sociaux** : Admin → Paramètres.
- **FAQ, textes des boutons, message WhatsApp** : `assets/js/i18n.js` (FR et AR).
- **Couleurs** : en haut de `assets/css/style.css` (`--brass` = couleur dorée, `--ink` = fond).
- **Images produits** : depuis l'admin (*Choisir une image*, compressée automatiquement)
  ou en collant un lien. Sans image, une couverture élégante est générée.

---

## Limites de l'offre gratuite Firebase

50 000 lectures et 20 000 écritures par jour — soit plusieurs milliers de visiteurs par jour.
Au-delà, Firebase vous prévient ; rien n'est facturé sans votre accord.
