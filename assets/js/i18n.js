// Textes de la boutique en français et en arabe.
// Pour modifier un texte, changez-le ici dans les deux langues.
import { store } from "./utils.js";
import { CONFIG } from "./config.js";

export const STRINGS = {
  fr: {
    nav_home: "Accueil", nav_shop: "Boutique", nav_faq: "Questions", search_ph: "Rechercher un produit…",
    cart: "Panier", cart_empty: "Votre panier est vide", cart_empty_hint: "Ajoutez un produit pour commencer votre commande.",
    browse: "Voir la boutique", subtotal: "Sous-total", total: "Total", checkout: "Commander", continue: "Continuer mes achats",
    remove: "Retirer", add_to_cart: "Ajouter au panier", buy_now: "Acheter maintenant", added: "Ajouté au panier",
    qty: "Quantité", all: "Tout", featured: "Les plus demandés", new_arrivals: "Nouveautés", see_all: "Tout voir",
    categories: "Catégories", products_count: (n) => `${n} produit${n > 1 ? "s" : ""}`, no_results: "Aucun produit ne correspond à votre recherche.",
    clear_filters: "Effacer la recherche", save: (p) => `-${p}%`, you_save: (v) => `Vous économisez ${v}`,
    whats_included: "Ce que vous recevez", description: "Description", related: "Vous aimerez aussi",
    trust_instant: "Livraison instantanée", trust_instant_d: "Reçu sur WhatsApp ou par email, juste après confirmation.",
    trust_secure: "Commande simple", trust_secure_d: "Pas de compte à créer : vous confirmez directement avec nous.",
    trust_support: "Support 7j/7", trust_support_d: "Une question ? On répond sur WhatsApp.",
    trust_access: "Accès à vie", trust_access_d: "Vos fichiers restent à vous, avec les mises à jour.",
    how_title: "Comment ça marche", how_1: "Choisissez vos produits", how_1d: "Ajoutez-les au panier.",
    how_2: "Envoyez la commande", how_2d: "Le récapitulatif s'ouvre dans WhatsApp, prêt à envoyer.",
    how_3: "Recevez vos fichiers", how_3d: "Après confirmation du paiement, on vous envoie l'accès.",
    faq_title: "Questions fréquentes",
    faq: [
      ["Comment je reçois mon produit ?", "Après la confirmation de votre paiement, nous vous envoyons le lien de téléchargement ou l'accès directement sur WhatsApp (et par email si vous l'avez indiqué)."],
      ["Quels moyens de paiement acceptez-vous ?", "Virement bancaire, CashPlus, Wafacash ou carte. Nous vous donnons les détails sur WhatsApp après réception de votre commande."],
      ["Combien de temps pour recevoir l'accès ?", "En général moins de 30 minutes après le paiement, de 9h à minuit, 7j/7."],
      ["Puis-je poser une question avant d'acheter ?", "Bien sûr. Cliquez sur le bouton WhatsApp en bas de l'écran et écrivez-nous."]
    ],
    co_title: "Finaliser la commande", co_info: "Vos informations", co_name: "Nom complet", co_phone: "Numéro WhatsApp",
    co_email: "Email (facultatif)", co_email_hint: "Pour recevoir aussi vos fichiers par email.", co_note: "Remarque (facultatif)",
    co_summary: "Récapitulatif", co_send: "Envoyer la commande sur WhatsApp", co_secure: "Vous serez redirigé vers WhatsApp avec le détail de votre commande. Rien n'est payé à cette étape.",
    co_err_name: "Indiquez votre nom.", co_err_phone: "Indiquez un numéro valide (au moins 9 chiffres).", co_err_empty: "Votre panier est vide.",
    ok_title: "Commande prête", ok_text: (id) => `Votre commande ${id} a été préparée. Si WhatsApp ne s'est pas ouvert, utilisez le bouton ci-dessous.`,
    ok_open: "Ouvrir WhatsApp", ok_back: "Retour à la boutique",
    not_found: "Ce produit n'existe pas ou n'est plus disponible.",
    footer_rights: (y, n) => `© ${y} ${n}. Tous droits réservés.`, footer_contact: "Contact", footer_follow: "Suivez-nous",
    wa_chat: "Discuter sur WhatsApp", lang_switch: "العربية",
    msg_title: "Nouvelle commande", msg_name: "Nom", msg_phone: "Téléphone", msg_email: "Email", msg_items: "Produits",
    msg_total: "Total", msg_note: "Remarque", msg_footer: "Merci de confirmer ma commande.",
    hero_cta: "Découvrir les produits", hero_cta2: "Comment ça marche", from: "À partir de"
  },
  ar: {
    nav_home: "الرئيسية", nav_shop: "المتجر", nav_faq: "الأسئلة", search_ph: "ابحث عن منتج…",
    cart: "السلة", cart_empty: "السلة ديالك خاوية", cart_empty_hint: "زيد شي منتج باش تبدا الطلب.",
    browse: "تصفح المتجر", subtotal: "المجموع الفرعي", total: "المجموع", checkout: "اطلب الآن", continue: "كمل التسوق",
    remove: "حذف", add_to_cart: "أضف للسلة", buy_now: "اشتري دابا", added: "تمت الإضافة للسلة",
    qty: "الكمية", all: "الكل", featured: "الأكثر طلباً", new_arrivals: "جديد المتجر", see_all: "شوف الكل",
    categories: "الأصناف", products_count: (n) => `${n} منتج`, no_results: "ما كاين حتى منتج كيطابق البحث ديالك.",
    clear_filters: "مسح البحث", save: (p) => `-${p}%`, you_save: (v) => `كتوفر ${v}`,
    whats_included: "شنو غادي توصل", description: "الوصف", related: "منتجات غادي تعجبك",
    trust_instant: "توصيل فوري", trust_instant_d: "كيوصلك فالواتساب أو الإيميل مباشرة بعد التأكيد.",
    trust_secure: "طلب ساهل", trust_secure_d: "ما محتاجش تصاوب حساب: كتأكد معانا نيشان.",
    trust_support: "دعم 7/7", trust_support_d: "عندك سؤال؟ كنجاوبوك فالواتساب.",
    trust_access: "ولوج مدى الحياة", trust_access_d: "الملفات ديالك كيبقاو عندك مع التحديثات.",
    how_title: "كيفاش كتخدم", how_1: "اختار المنتجات", how_1d: "زيدهم للسلة.",
    how_2: "صيفط الطلب", how_2d: "الملخص كيتحل فالواتساب، جاهز للإرسال.",
    how_3: "توصل بالملفات", how_3d: "من بعد تأكيد الأداء، كنصيفطو ليك الولوج.",
    faq_title: "الأسئلة الشائعة",
    faq: [
      ["كيفاش غادي نتوصل بالمنتج؟", "من بعد تأكيد الأداء، كنصيفطو ليك رابط التحميل أو الولوج مباشرة فالواتساب (والإيميل إلا عطيتيه)."],
      ["شنو هي طرق الأداء؟", "تحويل بنكي، كاش بلوس، وفاكاش أو البطاقة. كنعطيوك التفاصيل فالواتساب من بعد ما يوصلنا الطلب."],
      ["شحال ديال الوقت باش نتوصل؟", "غالباً أقل من 30 دقيقة من بعد الأداء، من 9 الصباح حتى 12 الليل، 7 أيام على 7."],
      ["واش نقدر نسول قبل ما نشري؟", "أكيد. ضغط على زر الواتساب لتحت وكتب لينا."]
    ],
    co_title: "إتمام الطلب", co_info: "المعلومات ديالك", co_name: "الاسم الكامل", co_phone: "رقم الواتساب",
    co_email: "الإيميل (اختياري)", co_email_hint: "باش توصل حتى بالإيميل.", co_note: "ملاحظة (اختياري)",
    co_summary: "ملخص الطلب", co_send: "صيفط الطلب فالواتساب", co_secure: "غادي تمشي للواتساب مع تفاصيل الطلب ديالك. ما كتخلص والو فهاد المرحلة.",
    co_err_name: "دخل الاسم ديالك.", co_err_phone: "دخل رقم صحيح (9 أرقام على الأقل).", co_err_empty: "السلة ديالك خاوية.",
    ok_title: "الطلب واجد", ok_text: (id) => `الطلب ديالك ${id} توجد. إلا ما تحلش الواتساب، استعمل الزر لتحت.`,
    ok_open: "حل الواتساب", ok_back: "رجوع للمتجر",
    not_found: "هاد المنتج ما كاينش أو ما بقاش متوفر.",
    footer_rights: (y, n) => `© ${y} ${n}. جميع الحقوق محفوظة.`, footer_contact: "تواصل معنا", footer_follow: "تابعنا",
    wa_chat: "تواصل فالواتساب", lang_switch: "Français",
    msg_title: "طلب جديد", msg_name: "الاسم", msg_phone: "الهاتف", msg_email: "الإيميل", msg_items: "المنتجات",
    msg_total: "المجموع", msg_note: "ملاحظة", msg_footer: "عافاكم أكدو ليا الطلب.",
    hero_cta: "اكتشف المنتجات", hero_cta2: "كيفاش كتخدم", from: "ابتداءً من"
  }
};

let lang = store.get("ds_lang", CONFIG.defaults.defaultLang || "fr");
if (!STRINGS[lang]) lang = "fr";

export const getLang = () => lang;
export const setLang = (l) => { lang = STRINGS[l] ? l : "fr"; store.set("ds_lang", lang); applyDir(); };
export const t = (key, ...args) => {
  const v = STRINGS[lang][key] ?? STRINGS.fr[key] ?? key;
  return typeof v === "function" ? v(...args) : v;
};
// Champ traduit d'un objet (ex: tr(product, "title") → title_ar ou title_fr)
export const tr = (obj, field) => (obj && (obj[`${field}_${lang}`] || obj[`${field}_fr`] || obj[field])) || "";

export const applyDir = () => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
};
