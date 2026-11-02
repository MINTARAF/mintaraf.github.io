// ============================================================
//  Contenu par défaut du site.
//  Tout ceci est modifiable depuis l'admin (Packs, Contenu, Paramètres).
//  Ces valeurs ne servent que tant que l'admin n'a rien enregistré.
// ============================================================

export const DEFAULT_SETTINGS = {
  brand: "Mintaraf",
  tagline_fr: "Votre service informatique à distance",
  tagline_ar: "المصلحة المعلوماتية ديالك عن بعد",
  phone: "06 00 00 00 00",
  whatsapp: "212600000000",
  email: "",
  city_fr: "Maroc",
  city_ar: "المغرب",
  hours_fr: "Du lundi au samedi, 9h – 20h",
  hours_ar: "من الاثنين للسبت، 9 الصباح – 8 الليل",
  zone_fr: "Déplacement sur site selon votre ville (à confirmer avec le technicien).",
  zone_ar: "التنقل للمحل حسب المدينة ديالك (كيتأكد مع التقني).",
  anydeskUrl: "https://anydesk.com/fr/downloads",
  payment_fr: "Paiement par virement, CashPlus ou Wafacash. Les détails vous sont envoyés sur WhatsApp.",
  payment_ar: "الأداء بالتحويل البنكي، كاش بلوس أو وفاكاش. كنصيفطو ليك التفاصيل فالواتساب.",
  facebook: "",
  instagram: "",
  linkedin: ""
};

export const DEFAULT_CONTENT = {
  announceOn: false,
  announce_fr: "",
  announce_ar: "",
  hero_kicker_fr: "Support informatique pour commerces et petites entreprises",
  hero_kicker_ar: "دعم معلوماتي للمحلات والشركات الصغيرة",
  hero_title_fr: "Votre service informatique, sans embaucher d'informaticien.",
  hero_title_ar: "مصلحة معلوماتية ديالك، بلا ما تخدم تقني معلوميات.",
  hero_sub_fr: "Un problème d'ordinateur, d'imprimante, de réseau ou de logiciel ? Un technicien se connecte à distance via AnyDesk ou appel vidéo et règle le problème. À partir de 199 DH, sans abonnement.",
  hero_sub_ar: "عندك مشكل فالبيسي، الطابعة، الويفي ولا شي برنامج؟ تقني كيدخل معاك عن بعد بـ AnyDesk ولا مكالمة فيديو وكيحل ليك المشكل. ابتداءً من 199 درهم، بلا اشتراك.",
  hero_points_fr: "Sans abonnement\nPrix fixe annoncé à l'avance\nConnexion sécurisée, contrôlée par vous",
  hero_points_ar: "بلا اشتراك\nثمن ثابت معروف من الأول\nاتصال آمن وانت اللي كتتحكم فيه",

  steps: [
    { icon: "layers", title_fr: "Choisissez votre pack", title_ar: "اختار الباقة",
      text_fr: "Selon l'urgence : rappel sous 24 h, intervention en moins de 30 min, ou technicien sur place.",
      text_ar: "حسب الاستعجال: نتاصلو بيك فـ 24 ساعة، تدخل فأقل من 30 دقيقة، ولا تقني كيجي عندك." },
    { icon: "fileText", title_fr: "Décrivez le problème", title_ar: "وصف المشكل",
      text_fr: "Quelques lignes suffisent. La demande nous arrive aussi sur WhatsApp.",
      text_ar: "شي سطور كافيين. الطلب كيوصلنا حتى فالواتساب." },
    { icon: "screen", title_fr: "On règle le problème", title_ar: "كنحلو المشكل",
      text_fr: "Le technicien vous contacte et se connecte via AnyDesk ou appel vidéo, avec votre accord.",
      text_ar: "التقني كيتاصل بيك وكيدخل بـ AnyDesk ولا مكالمة فيديو، بالموافقة ديالك." }
  ],

  services: [
    { icon: "monitor", title_fr: "Ordinateur lent ou bloqué", title_ar: "بيسي ثقيل ولا مبلوكي",
      text_fr: "Démarrage lent, écran bleu, mises à jour qui bloquent.", text_ar: "كيطول فالتشغيل، شاشة زرقاء، تحديثات مبلوكية." },
    { icon: "wifi", title_fr: "Internet et Wi-Fi", title_ar: "الأنترنت والويفي",
      text_fr: "Connexion qui coupe, box, routeur, partage réseau.", text_ar: "الكونيكسيون كتقطع، البوكس، الروتور، الشبكة." },
    { icon: "printer", title_fr: "Imprimantes et scanners", title_ar: "الطابعات والسكانير",
      text_fr: "Installation, pilotes, impression qui ne sort pas.", text_ar: "التثبيت، البيلوط، الطباعة اللي ما كتخرجش." },
    { icon: "mail", title_fr: "Emails et Outlook", title_ar: "الإيميل و Outlook",
      text_fr: "Configuration de boîte mail, messages bloqués, signatures.", text_ar: "إعداد الإيميل، رسائل مبلوكية، التوقيع." },
    { icon: "shield", title_fr: "Virus et sécurité", title_ar: "الفيروسات والحماية",
      text_fr: "Nettoyage, antivirus, mots de passe, comptes piratés.", text_ar: "التنظيف، الأنتيفيروس، كلمات السر، حسابات مقرصنة." },
    { icon: "apps", title_fr: "Logiciels et installation", title_ar: "البرامج والتثبيت",
      text_fr: "Office, logiciels de caisse ou de comptabilité, mises à jour.", text_ar: "Office، برامج الكاسة ولا المحاسبة، التحديثات." }
  ],

  why: [
    { icon: "lock", title_fr: "Vous gardez le contrôle", title_ar: "انت اللي كتتحكم",
      text_fr: "Aucune connexion sans votre accord. Vous voyez tout ce que fait le technicien et pouvez couper à tout moment.",
      text_ar: "حتى اتصال بلا موافقتك. كتشوف كلشي اللي كيدير التقني وتقدر تقطع فأي وقت." },
    { icon: "tag", title_fr: "Prix clair, sans surprise", title_ar: "ثمن واضح بلا مفاجآت",
      text_fr: "Le prix du pack est affiché avant la demande. Pas d'abonnement, pas d'engagement.",
      text_ar: "ثمن الباقة باين قبل الطلب. بلا اشتراك، بلا التزام." },
    { icon: "store", title_fr: "Pensé pour les petites structures", title_ar: "مصاوب للمحلات الصغيرة",
      text_fr: "Commerces, cabinets, agences, cafés : un informaticien quand vous en avez besoin, seulement.",
      text_ar: "محلات، عيادات، وكالات، مقاهي: تقني معلوميات غير ملي تحتاجو." }
  ],

  faq: [
    { q_fr: "Comment le technicien accède-t-il à mon ordinateur ?", q_ar: "كيفاش التقني كيدخل للبيسي ديالي؟",
      a_fr: "Avec AnyDesk, un logiciel gratuit de prise en main à distance. Vous lui donnez un code, vous acceptez la connexion, et vous pouvez l'arrêter à tout moment. Pour certains problèmes, un simple appel vidéo suffit.",
      a_ar: "بـ AnyDesk، برنامج مجاني ديال التحكم عن بعد. كتعطيه كود، كتقبل الاتصال، وتقدر توقفو فأي وقت. فبعض المشاكل، مكالمة فيديو كافية." },
    { q_fr: "Et si le problème ne peut pas être réglé à distance ?", q_ar: "وإلا المشكل ما تحلش عن بعد؟",
      a_fr: "Le technicien vous le dit et vous propose le pack Sur site : il se déplace dans vos locaux.",
      a_ar: "التقني كيقولها ليك وكيقترح عليك باقة التنقل: كيجي للمحل ديالك." },
    { q_fr: "Comment je paie ?", q_ar: "كيفاش نخلص؟",
      a_fr: "Les modalités de paiement vous sont envoyées sur WhatsApp après votre demande.",
      a_ar: "طريقة الأداء كنصيفطوها ليك فالواتساب من بعد الطلب." },
    { q_fr: "Mes données restent-elles confidentielles ?", q_ar: "واش المعطيات ديالي كتبقى سرية؟",
      a_fr: "Oui. Le technicien n'accède qu'à ce qui est nécessaire pour régler le problème, uniquement pendant la session que vous autorisez.",
      a_ar: "إيه. التقني ما كيدخل غير للحاجة اللي ضرورية باش يحل المشكل، وغير فالوقت اللي سمحتي فيه." }
  ]
};

export const DEFAULT_PACKS = [
  {
    id: "standard", order: 1, active: true, highlight: false, mode: "remote", icon: "clock", price: 199,
    name_fr: "Pack Standard", name_ar: "الباقة العادية",
    delay_fr: "Rappel sous 24 h", delay_ar: "كنتاصلو بيك فـ 24 ساعة",
    desc_fr: "Pour les problèmes qui peuvent attendre quelques heures.",
    desc_ar: "للمشاكل اللي تقدر تتسنى شي سوايع.",
    features_fr: "Intervention à distance (AnyDesk ou appel vidéo)\nUn technicien vous rappelle sous 24 h\nDiagnostic et résolution du problème\nConseils pour éviter que ça recommence",
    features_ar: "تدخل عن بعد (AnyDesk ولا مكالمة فيديو)\nتقني كيعيط ليك فـ 24 ساعة\nتشخيص وحل المشكل\nنصائح باش ما يعاودش",
    badge_fr: "", badge_ar: ""
  },
  {
    id: "urgent", order: 2, active: true, highlight: true, mode: "remote", icon: "bolt", price: 299,
    name_fr: "Pack Urgent", name_ar: "الباقة المستعجلة",
    delay_fr: "Prise en charge en moins de 30 min", delay_ar: "تدخل فأقل من 30 دقيقة",
    desc_fr: "Votre activité est bloquée ? On intervient tout de suite.",
    desc_ar: "الخدمة ديالك واقفة؟ كنتدخلو دغيا.",
    features_fr: "Intervention à distance (AnyDesk ou appel vidéo)\nUn technicien vous contacte en moins de 30 min\nPriorité sur toutes les autres demandes\nDiagnostic et résolution du problème",
    features_ar: "تدخل عن بعد (AnyDesk ولا مكالمة فيديو)\nتقني كيتاصل بيك فأقل من 30 دقيقة\nالأولوية على جميع الطلبات\nتشخيص وحل المشكل",
    badge_fr: "Prioritaire", badge_ar: "أولوية"
  },
  {
    id: "onsite", order: 3, active: true, highlight: false, mode: "onsite", icon: "van", price: 499,
    name_fr: "Pack Sur site", name_ar: "باقة التنقل",
    delay_fr: "Un technicien se déplace chez vous", delay_ar: "تقني كيتنقل عندك",
    desc_fr: "Pour les pannes matérielles ou les gros problèmes qui ne se règlent pas à distance.",
    desc_ar: "للأعطاب فالماتيريال ولا المشاكل الكبار اللي ما كيتحلوش عن بعد.",
    features_fr: "Déplacement d'un technicien dans vos locaux\nMatériel, réseau, imprimantes, installation\nDiagnostic complet sur place\nRendez-vous fixé avec vous",
    features_ar: "تقني كيتنقل للمحل ديالك\nالماتيريال، الشبكة، الطابعات، التثبيت\nتشخيص كامل فالبلاصة\nموعد كيتحدد معاك",
    badge_fr: "", badge_ar: ""
  }
];
