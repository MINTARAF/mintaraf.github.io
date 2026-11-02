// Textes fixes de l'interface (boutons, formulaires) en français et en arabe.
// Les textes "marketing" (titres, packs, services, FAQ) se modifient depuis l'admin.
import { store } from "./utils.js";
import { CONFIG } from "./config.js";

export const STRINGS = {
  fr: {
    nav_packs: "Tarifs", nav_how: "Comment ça marche", nav_services: "Services", nav_faq: "Questions", nav_contact: "Contact",
    cta_request: "Demander un technicien", lang_switch: "العربية", menu: "Menu", close: "Fermer",
    see_packs: "Voir les packs", wa_write: "Écrire sur WhatsApp", call: "Appeler",
    packs_kicker: "Tarifs", packs_title: "Un pack selon l'urgence", packs_sub: "Prix fixe par intervention. Vous choisissez, on s'occupe du reste.",
    per_intervention: "par intervention", choose_pack: "Choisir ce pack", remote: "À distance", onsite: "Sur site",
    how_kicker: "Comment ça marche", how_title: "Réglé en 3 étapes",
    services_kicker: "Ce qu'on règle", services_title: "Les problèmes du quotidien, pris en charge",
    services_more: "Votre problème n'est pas dans la liste ? Décrivez-le dans la demande.",
    why_kicker: "Pourquoi nous", why_title: "Simple, sûr et transparent",
    faq_kicker: "Questions", faq_title: "Questions fréquentes",
    contact_title: "Un problème en ce moment ?", contact_sub: "Choisissez un pack ou écrivez-nous directement.",
    example: "Exemple", demo_ticket: "Demande", demo_s1: "Demande reçue", demo_s2: "Technicien connecté via AnyDesk", demo_s3: "Problème résolu",
    // Formulaire de demande
    req_title: "Votre demande", req_back: "Changer de pack", req_name: "Nom complet", req_company: "Entreprise ou commerce",
    optional: "facultatif", req_phone: "Téléphone (WhatsApp)", req_city: "Ville", req_address: "Adresse de l'intervention",
    req_category: "Type de problème", req_category_ph: "Choisissez…", req_other: "Autre",
    req_problem: "Décrivez le problème", req_problem_ph: "Ex : depuis ce matin l'imprimante n'imprime plus, un message d'erreur s'affiche…",
    req_pref: "Comment préférez-vous être aidé ?", pref_anydesk: "AnyDesk", pref_video: "Appel vidéo", pref_any: "Peu importe",
    req_send: "Envoyer la demande", req_sending: "Envoi…",
    req_note: "Après l'envoi, WhatsApp s'ouvre avec le détail de votre demande pour que vous puissiez nous l'envoyer aussi.",
    req_prepare: "Préparez-vous", req_prepare_d: "Installez AnyDesk dès maintenant : le technicien pourra se connecter tout de suite.",
    req_download: "Télécharger AnyDesk", req_payment: "Paiement",
    err_name: "Indiquez votre nom.", err_phone: "Indiquez un numéro valide (au moins 9 chiffres).", err_city: "Indiquez votre ville.",
    err_address: "Indiquez l'adresse de l'intervention.", err_category: "Choisissez le type de problème.",
    err_problem: "Décrivez le problème en quelques mots (10 caractères minimum).", err_wait: "Une demande vient d'être envoyée. Patientez une minute avant d'en envoyer une autre.",
    err_unknown_pack: "Ce pack n'existe pas ou n'est plus disponible.",
    // Confirmation
    ok_title: "Demande envoyée", ok_ticket: "Numéro de demande",
    ok_text: "Gardez ce numéro. Si WhatsApp ne s'est pas ouvert, utilisez le bouton ci-dessous pour nous envoyer le détail.",
    ok_next: "Et maintenant ?", ok_open_wa: "Envoyer sur WhatsApp", ok_home: "Retour à l'accueil",
    ok_saved_fail: "La demande n'a pas pu être enregistrée en ligne. Envoyez-la sur WhatsApp pour être sûr qu'elle nous arrive.",
    // Message WhatsApp
    msg_title: "Nouvelle demande IT", msg_pack: "Pack", msg_name: "Nom", msg_company: "Entreprise", msg_phone: "Téléphone",
    msg_city: "Ville", msg_address: "Adresse", msg_category: "Problème", msg_pref: "Préférence", msg_footer: "Merci de me contacter.",
    footer_rights: (y, n) => `© ${y} ${n}. Tous droits réservés.`, footer_contact: "Contact", footer_links: "Liens", footer_follow: "Suivez-nous",
    not_found: "Page introuvable."
  },
  ar: {
    nav_packs: "الأثمنة", nav_how: "كيفاش كتخدم", nav_services: "الخدمات", nav_faq: "الأسئلة", nav_contact: "تواصل",
    cta_request: "طلب تقني", lang_switch: "Français", menu: "القائمة", close: "سد",
    see_packs: "شوف الباقات", wa_write: "كتب لينا فالواتساب", call: "عيط",
    packs_kicker: "الأثمنة", packs_title: "باقة حسب الاستعجال", packs_sub: "ثمن ثابت لكل تدخل. انت اختار، واحنا نتكلفو بالباقي.",
    per_intervention: "للتدخل", choose_pack: "اختار هاد الباقة", remote: "عن بعد", onsite: "فالبلاصة",
    how_kicker: "كيفاش كتخدم", how_title: "محلول فـ 3 مراحل",
    services_kicker: "شنو كنحلو", services_title: "مشاكل كل نهار، كنتكلفو بيها",
    services_more: "المشكل ديالك ماشي فاللائحة؟ وصفو فالطلب.",
    why_kicker: "علاش احنا", why_title: "ساهل، آمن وواضح",
    faq_kicker: "الأسئلة", faq_title: "الأسئلة الشائعة",
    contact_title: "عندك مشكل دابا؟", contact_sub: "اختار باقة ولا كتب لينا نيشان.",
    example: "مثال", demo_ticket: "طلب", demo_s1: "توصلنا بالطلب", demo_s2: "التقني دخل بـ AnyDesk", demo_s3: "المشكل تحل",
    req_title: "الطلب ديالك", req_back: "بدل الباقة", req_name: "الاسم الكامل", req_company: "الشركة ولا المحل",
    optional: "اختياري", req_phone: "الهاتف (واتساب)", req_city: "المدينة", req_address: "العنوان ديال التدخل",
    req_category: "نوع المشكل", req_category_ph: "اختار…", req_other: "آخر",
    req_problem: "وصف المشكل", req_problem_ph: "مثلاً: من الصباح الطابعة ما بقاتش كتطبع، كيبان ميساج ديال الخطأ…",
    req_pref: "كيفاش بغيتي نعاونوك؟", pref_anydesk: "AnyDesk", pref_video: "مكالمة فيديو", pref_any: "كيفما بغيتو",
    req_send: "صيفط الطلب", req_sending: "كيتصيفط…",
    req_note: "من بعد الإرسال، الواتساب كيتحل فيه تفاصيل الطلب باش تصيفطو لينا حتى تما.",
    req_prepare: "وجد راسك", req_prepare_d: "ثبت AnyDesk من دابا: التقني يقدر يدخل نيشان.",
    req_download: "تحميل AnyDesk", req_payment: "الأداء",
    err_name: "دخل الاسم ديالك.", err_phone: "دخل رقم صحيح (9 أرقام على الأقل).", err_city: "دخل المدينة ديالك.",
    err_address: "دخل العنوان ديال التدخل.", err_category: "اختار نوع المشكل.",
    err_problem: "وصف المشكل بشي كلمات (10 حروف على الأقل).", err_wait: "باقي صيفطتي طلب دابا. تسنى دقيقة قبل ما تصيفط آخر.",
    err_unknown_pack: "هاد الباقة ما كايناش ولا ما بقاتش متوفرة.",
    ok_title: "الطلب تصيفط", ok_ticket: "رقم الطلب",
    ok_text: "حتافظ بهاد الرقم. إلا ما تحلش الواتساب، استعمل الزر لتحت باش تصيفط لينا التفاصيل.",
    ok_next: "ودابا؟", ok_open_wa: "صيفط فالواتساب", ok_home: "رجوع للرئيسية",
    ok_saved_fail: "الطلب ما تسجلش أونلاين. صيفطو فالواتساب باش تكون متأكد أنه وصلنا.",
    msg_title: "طلب IT جديد", msg_pack: "الباقة", msg_name: "الاسم", msg_company: "الشركة", msg_phone: "الهاتف",
    msg_city: "المدينة", msg_address: "العنوان", msg_category: "المشكل", msg_pref: "التفضيل", msg_footer: "عافاكم تاصلو بيا.",
    footer_rights: (y, n) => `© ${y} ${n}. جميع الحقوق محفوظة.`, footer_contact: "تواصل", footer_links: "روابط", footer_follow: "تابعنا",
    not_found: "الصفحة ما كايناش."
  }
};

let lang = store.get("it_lang", CONFIG.defaultLang || "fr");
if (!STRINGS[lang]) lang = "fr";

export const getLang = () => lang;
export const setLang = (l) => { lang = STRINGS[l] ? l : "fr"; store.set("it_lang", lang); applyDir(); };
export const t = (key, ...args) => {
  const v = STRINGS[lang][key] ?? STRINGS.fr[key] ?? key;
  return typeof v === "function" ? v(...args) : v;
};
// Champ traduit d'un objet (ex : tr(pack, "name") → name_ar ou name_fr)
export const tr = (obj, field) => (obj && (obj[`${field}_${lang}`] || obj[`${field}_fr`] || obj[field])) || "";

export const applyDir = () => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
};
