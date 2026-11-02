// Données d'exemple (chargées automatiquement en mode démo,
// et importables depuis l'admin en mode Firebase)

export const SEED_CATEGORIES = [
  { id: "formations", name_fr: "Formations", name_ar: "دورات تكوينية", icon: "🎓", order: 1 },
  { id: "templates", name_fr: "Templates", name_ar: "قوالب جاهزة", icon: "🎨", order: 2 },
  { id: "ebooks", name_fr: "E-books", name_ar: "كتب إلكترونية", icon: "📘", order: 3 },
  { id: "outils", name_fr: "Outils & packs", name_ar: "أدوات وباقات", icon: "🧰", order: 4 }
];

const now = Date.now();
const d = (i) => now - i * 86400000;

export const SEED_PRODUCTS = [
  {
    id: "formation-ecommerce-maroc",
    title_fr: "Formation e-commerce au Maroc",
    title_ar: "تكوين التجارة الإلكترونية في المغرب",
    short_fr: "6 heures de vidéo pour lancer votre boutique, de l'idée à la première vente.",
    short_ar: "6 ساعات فيديو باش تطلق المتجر ديالك، من الفكرة حتى أول بيعة.",
    description_fr: "Une formation pas à pas pensée pour le marché marocain : choix du produit, création de la boutique, paiement à la livraison, publicité Facebook et TikTok, et gestion des retours.\n\nAccès à vie, mises à jour incluses.",
    description_ar: "تكوين خطوة بخطوة مخصص للسوق المغربي: اختيار المنتج، إنشاء المتجر، الدفع عند الاستلام، إعلانات فيسبوك وتيك توك، وتسيير المرتجعات.\n\nولوج مدى الحياة مع التحديثات.",
    features_fr: "42 leçons vidéo (6 h)\nModèles de pubs prêts à l'emploi\nGroupe d'entraide privé\nCertificat de fin de formation",
    features_ar: "42 درس فيديو (6 ساعات)\nنماذج إعلانات جاهزة\nمجموعة دعم خاصة\nشهادة إتمام التكوين",
    price: 299, oldPrice: 599, category: "formations", badge_fr: "Best-seller", badge_ar: "الأكثر مبيعاً",
    published: true, featured: true, createdAt: d(1), image: ""
  },
  {
    id: "pack-templates-instagram",
    title_fr: "Pack 300 templates Instagram",
    title_ar: "باقة 300 قالب إنستغرام",
    short_fr: "Posts, stories et reels modifiables en quelques clics.",
    short_ar: "بوستات، ستوريات وريلز قابلة للتعديل بسهولة.",
    description_fr: "300 designs modernes pour boutiques, coachs et créateurs. Modifiez les couleurs, textes et photos en quelques minutes, sans compétence en design.",
    description_ar: "300 تصميم عصري للمتاجر والكوتشات وصناع المحتوى. بدّل الألوان والنصوص والصور فدقايق، بلا ما تحتاج خبرة فالتصميم.",
    features_fr: "120 posts + 120 stories + 60 couvertures reels\nCompatible Canva (version gratuite)\nPolices et couleurs incluses\nGuide vidéo d'utilisation",
    features_ar: "120 بوست + 120 ستوري + 60 غلاف ريلز\nمتوافق مع كانفا (النسخة المجانية)\nالخطوط والألوان مرفقة\nدليل فيديو للاستعمال",
    price: 149, oldPrice: 249, category: "templates", badge_fr: "Nouveau", badge_ar: "جديد",
    published: true, featured: true, createdAt: d(2), image: ""
  },
  {
    id: "ebook-business-en-ligne",
    title_fr: "E-book : lancer son business en ligne",
    title_ar: "كتاب: أطلق مشروعك على الإنترنت",
    short_fr: "Le guide de 120 pages pour passer de l'idée au premier client.",
    short_ar: "دليل من 120 صفحة باش تمشي من الفكرة لأول زبون.",
    description_fr: "Méthodes concrètes, exemples marocains et checklists à imprimer. Disponible en PDF, lisible sur téléphone.",
    description_ar: "طرق عملية، أمثلة مغربية، ولوائح جاهزة للطباعة. متوفر بصيغة PDF ويتقرا فالتيليفون.",
    features_fr: "120 pages en PDF\n12 checklists imprimables\nÉtudes de cas marocaines",
    features_ar: "120 صفحة PDF\n12 لائحة قابلة للطباعة\nدراسات حالة مغربية",
    price: 79, oldPrice: 0, category: "ebooks", badge_fr: "", badge_ar: "",
    published: true, featured: true, createdAt: d(3), image: ""
  },
  {
    id: "pack-cv-lettres",
    title_fr: "Pack CV & lettres de motivation",
    title_ar: "باقة السيرة الذاتية ورسائل التحفيز",
    short_fr: "25 modèles professionnels en français et en arabe, format Word et PDF.",
    short_ar: "25 نموذج احترافي بالفرنسية والعربية، بصيغة Word و PDF.",
    description_fr: "Des CV clairs qui passent les filtres des recruteurs, avec des lettres adaptées aux stages, premiers emplois et reconversions.",
    description_ar: "سير ذاتية واضحة كتعجب المشغلين، مع رسائل مناسبة للتداريب، أول خدمة، وتغيير المسار المهني.",
    features_fr: "25 CV + 15 lettres\nWord et PDF modifiables\nFrançais et arabe",
    features_ar: "25 سيرة ذاتية + 15 رسالة\nWord و PDF قابلة للتعديل\nبالفرنسية والعربية",
    price: 59, oldPrice: 99, category: "templates", badge_fr: "", badge_ar: "",
    published: true, featured: false, createdAt: d(4), image: ""
  },
  {
    id: "formation-montage-mobile",
    title_fr: "Formation montage vidéo sur mobile",
    title_ar: "تكوين المونتاج بالتيليفون",
    short_fr: "Créez des reels et vidéos TikTok de qualité pro avec votre téléphone.",
    short_ar: "دير ريلز وفيديوهات تيك توك باحترافية غير بالتيليفون ديالك.",
    description_fr: "Cadrage, lumière, montage, sous-titres et musique : tout ce qu'il faut pour des vidéos qui retiennent l'attention.",
    description_ar: "التصوير، الضو، المونتاج، الترجمة والموسيقى: كلشي اللي خاصك باش تدير فيديوهات كتشد الانتباه.",
    features_fr: "28 leçons courtes\nFichiers d'exercice inclus\nAccès à vie",
    features_ar: "28 درس قصير\nملفات التمارين مرفقة\nولوج مدى الحياة",
    price: 199, oldPrice: 349, category: "formations", badge_fr: "", badge_ar: "",
    published: true, featured: true, createdAt: d(5), image: ""
  },
  {
    id: "presets-lightroom",
    title_fr: "40 presets Lightroom",
    title_ar: "40 بريسيت لايتروم",
    short_fr: "Des photos lumineuses et cohérentes en un seul clic.",
    short_ar: "صور مضوية ومتناسقة بضغطة وحدة.",
    description_fr: "Presets pour mobile et ordinateur, testés sur portraits, produits et voyages.",
    description_ar: "بريسيتات للتيليفون والحاسوب، مجربة على البورتريه، المنتجات والسفر.",
    features_fr: "40 presets (DNG + XMP)\nMobile et ordinateur\nTutoriel d'installation",
    features_ar: "40 بريسيت (DNG + XMP)\nللتيليفون والحاسوب\nشرح طريقة التثبيت",
    price: 69, oldPrice: 129, category: "outils", badge_fr: "", badge_ar: "",
    published: true, featured: false, createdAt: d(6), image: ""
  },
  {
    id: "formation-excel",
    title_fr: "Excel, de zéro à pro",
    title_ar: "إكسيل من الصفر للاحتراف",
    short_fr: "Formules, tableaux croisés et tableaux de bord, avec exercices corrigés.",
    short_ar: "المعادلات، الجداول المحورية ولوحات القيادة، مع تمارين مصححة.",
    description_fr: "La formation idéale pour les étudiants et les employés qui veulent gagner du temps au travail.",
    description_ar: "التكوين المثالي للطلبة والموظفين اللي بغاو يربحو الوقت فالخدمة.",
    features_fr: "35 leçons vidéo\n50 exercices corrigés\nModèles de tableaux de bord",
    features_ar: "35 درس فيديو\n50 تمرين مصحح\nنماذج لوحات القيادة",
    price: 179, oldPrice: 0, category: "formations", badge_fr: "", badge_ar: "",
    published: true, featured: false, createdAt: d(7), image: ""
  },
  {
    id: "planner-digital",
    title_fr: "Planner digital 2027",
    title_ar: "المخطط الرقمي 2027",
    short_fr: "Un agenda PDF interactif pour tablette, avec onglets cliquables.",
    short_ar: "أجندة PDF تفاعلية للتابليت، بأقسام قابلة للنقر.",
    description_fr: "Objectifs, habitudes, budget et planning hebdomadaire dans un seul fichier, compatible GoodNotes et Notability.",
    description_ar: "الأهداف، العادات، الميزانية والبرنامج الأسبوعي فملف واحد، متوافق مع GoodNotes و Notability.",
    features_fr: "400+ pages liées\nVersions claire et sombre\nCalendrier 2027 complet",
    features_ar: "أكثر من 400 صفحة مترابطة\nنسخة فاتحة وداكنة\nتقويم 2027 كامل",
    price: 49, oldPrice: 89, category: "outils", badge_fr: "", badge_ar: "",
    published: true, featured: false, createdAt: d(8), image: ""
  }
];

export const SEED_SETTINGS = {
  storeName: "Najma Digital",
  whatsapp: "212600000000",
  currency: "DH",
  email: "contact@exemple.ma",
  announcement_fr: "Livraison instantanée sur WhatsApp, 7j/7",
  announcement_ar: "التوصيل فوري عبر واتساب، 7 أيام على 7",
  heroTitle_fr: "Des produits digitaux pour apprendre, créer et vendre",
  heroTitle_ar: "منتجات رقمية باش تتعلم، تبدع وتبيع",
  heroSubtitle_fr: "Formations, templates et e-books choisis avec soin. Vous commandez, on vous les envoie directement sur WhatsApp.",
  heroSubtitle_ar: "دورات، قوالب وكتب مختارة بعناية. كتطلب، وكنصيفطوها ليك نيشان فالواتساب.",
  instagram: "",
  facebook: "",
  tiktok: ""
};
