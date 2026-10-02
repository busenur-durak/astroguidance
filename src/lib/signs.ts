import type { ElementKey, ModalityKey, SignKey } from "@/lib/types"

export type SignInfo = {
  key: SignKey
  label: string
  glyph: string
  element: ElementKey
  modality: ModalityKey
  ruler: string
  keywords: string[]
  sun: string
  moon: string
  rising: string
}

export const SIGN_ORDER: SignKey[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces"
]

export const SIGNS: Record<SignKey, SignInfo> = {
  aries: {
    key: "aries",
    label: "Koç",
    glyph: "♈",
    element: "fire",
    modality: "cardinal",
    ruler: "Mars",
    keywords: ["cesaret", "başlangıç", "hız"],
    sun: "Özünde bir kıvılcım taşırsın. Karar verdiğin anda harekete geçmek, beklemekten daha doğal gelir. Yolunu kendi açmak istersin ve durağanlık seni çabuk sıkar.",
    moon: "Duygusal dünyan hızlı yanar, hızlı diner. Kendini güvende hissetmek için ilerleme ve seçenek ihtiyacın vardır. Öfken dürüsttür; saklamak yerine boşaltmayı tercih edersin.",
    rising: "İlk izlenimin canlı, doğrudan ve cesurdur. Odaya girdiğinde enerji yükselir. İnsanlar senden netlik ve öncülük bekler."
  },
  taurus: {
    key: "taurus",
    label: "Boğa",
    glyph: "♉",
    element: "earth",
    modality: "fixed",
    ruler: "Venüs",
    keywords: ["istikrar", "duyu", "sadakat"],
    sun: "Değer verdiğin şeyleri yavaş ve kalıcı biçimde büyütürsün. Konfor, güzellik ve güven senin için lüks değil temel ihtiyaçtır. Acele ettirilmekten hoşlanmazsın.",
    moon: "Duyguların toprak ister: düzenli ritüeller, sevdiğin yemekler, dokunuş ve sadakat. Değişim tehdit gibi gelebilir; köklerin sağlamsa yüreğin açılır.",
    rising: "Sakin, estetik ve güven veren bir duruşun vardır. İnsanlar yanında durulabileceğini hisseder. İlk izlenimin sıcak ve maddi zarafetlidir."
  },
  gemini: {
    key: "gemini",
    label: "İkizler",
    glyph: "♊",
    element: "air",
    modality: "mutable",
    ruler: "Merkür",
    keywords: ["merak", "dil", "çeşitlilik"],
    sun: "Zihnin sürekli köprü kurar. Öğrenmek, anlatmak ve bağlantı toplamak senin yaşam oksijenindir. Tek bir kimliğe sıkışmak yerine çok sesli kalmak istersin.",
    moon: "Duygularını konuşarak, yazarak veya fikir değiştirerek işlersin. Sıkılınca iç dünya dağılır. Zihinsel uyarım, duygusal besindir.",
    rising: "İlk bakışta çevik, esprili ve ulaşılabilirdir. Soru sorar, hava değiştirir, odadaki dili yumuşatırsın. İnsanlar seninle konuşunca daha zeki hisseder."
  },
  cancer: {
    key: "cancer",
    label: "Yengeç",
    glyph: "♋",
    element: "water",
    modality: "cardinal",
    ruler: "Ay",
    keywords: ["koruma", "hafıza", "yuva"],
    sun: "Aidiyet senin pusulan. Sevdiklerini büyütmek, hatırlamak ve sarmak içgüdündür. Dışarıya nazik görünsen de içeride güçlü bir koruma refleksi vardır.",
    moon: "Duygusal gelgitlerin belirgindir. Güvenli bir yuva, geçmişin yumuşak hatırası ve empati seni dengeler. Reddedilme korkusu, bağ kurma yeteneğin kadar derindir.",
    rising: "İlk izlenimin yumuşak, sezgisel ve ev gibi hissettirir. İnsanlar sana sırlarını bırakır. Koruyucu bir aura taşırsın."
  },
  leo: {
    key: "leo",
    label: "Aslan",
    glyph: "♌",
    element: "fire",
    modality: "fixed",
    ruler: "Güneş",
    keywords: ["ifade", "onur", "cömertlik"],
    sun: "Kalbin sahne ister: görünmek, yaratmak ve ilham vermek. Onurun kırıldığında dünya daralır; takdir edildiğinde ise etrafını ısıtırsın.",
    moon: "Duygusal olarak görülmeye ve özel hissetmeye ihtiyaç duyarsın. Sadık bir alkış, iç çocuğunu iyileştirir. Dramın altında büyük bir sadakat yatar.",
    rising: "İlk izlenimin ışıklı, asil ve akılda kalıcıdır. Duruşun dikkat çeker. İnsanlar senden yürek ve sahicilik bekler."
  },
  virgo: {
    key: "virgo",
    label: "Başak",
    glyph: "♍",
    element: "earth",
    modality: "mutable",
    ruler: "Merkür",
    keywords: ["ustalık", "hizmet", "ayrıntı"],
    sun: "Anlamı iyileştirmekte, sadeleştirmekte ve işe yarar kılmakta bulursun. Kusursuzluk arayışın hem hediyen hem yükündür. Küçük düzeltmelerle büyük fark yaratırsın.",
    moon: "Kaygını düzenleyerek, işe yaramaya çalışarak ve bedenini dinleyerek yatıştırırsın. Eleştiri iç sesin olabilir; şefkat öğrendikçe zihin sakinleşir.",
    rising: "İlk izlenimin özenli, zeki ve mütevazıdır. İnsanlar sana pratik çözüm için gelir. Temiz bir netlik yayarsın."
  },
  libra: {
    key: "libra",
    label: "Terazi",
    glyph: "♎",
    element: "air",
    modality: "cardinal",
    ruler: "Venüs",
    keywords: ["denge", "estetik", "ilişki"],
    sun: "Adalet ve zarafet senin iç pusulan. Karşı tarafı görmeden karar vermek zor gelir. Güzellik, diplomasi ve eşitlik hayatı anlamlı kılar.",
    moon: "Duygusal dengeni ilişkilerde ararsın. Çatışma seni yorar; uyum ise besler. Yalnız kalınca bile zihninde bir diyalog devam eder.",
    rising: "İlk izlenimin zarif, ölçülü ve çekicidir. Ortamı güzelleştirir, köşeleri yumuşatırsın. İnsanlar yanında daha kibar konuşur."
  },
  scorpio: {
    key: "scorpio",
    label: "Akrep",
    glyph: "♏",
    element: "water",
    modality: "fixed",
    ruler: "Plüton",
    keywords: ["derinlik", "dönüşüm", "sadakat"],
    sun: "Yüzey seni ilgilendirmez. Gerçeğin altına inmek, bağın yoğunluğunu test etmek ve küllerinden doğmak senin yolundur. Yarıda bırakılan işlerin tadı kaçardır.",
    moon: "Duyguların özel ve güçlüdür. Güven kazanılmadan kapı açılmaz. İhanet izi bırakır; gerçek bağ ise seni yeniden yaratır.",
    rising: "İlk izlenimin manyetik, ciddi ve unutulmazdır. Bakışın fazla şey söyler. İnsanlar sende hem çekim hem gizem hisseder."
  },
  sagittarius: {
    key: "sagittarius",
    label: "Yay",
    glyph: "♐",
    element: "fire",
    modality: "mutable",
    ruler: "Jüpiter",
    keywords: ["anlam", "ufuk", "özgürlük"],
    sun: "Hayat senin için bir yolculuk ve bir inanç meselesidir. Dar kalıplar boğar; öğrenmek, gezmek ve büyük resmi görmek seni canlı tutar.",
    moon: "Ruhun açık havaya ve umuda ihtiyaç duyar. Sıkışınca mizah ve kaçış ararsın. Anlam bulunca duyguların genişler.",
    rising: "İlk izlenimin sıcak, maceracı ve dürüsttür. Büyük laflar, büyük gülüşler. İnsanlar yanında ufuklarının açıldığını hisseder."
  },
  capricorn: {
    key: "capricorn",
    label: "Oğlak",
    glyph: "♑",
    element: "earth",
    modality: "cardinal",
    ruler: "Satürn",
    keywords: ["yapı", "sorumluluk", "zirve"],
    sun: "Zamanı müttefikin bilirsin. İtibar, emek ve kalıcı sonuç senin dilindir. Dağın tepesi cazip olsa da yolu adım adım çıkmayı tercih edersin.",
    moon: "Duygularını görev ve yeterlilik üzerinden düzenlersin. Güven, kontrol ve omuzlardaki yükle yakından ilişkilidir. Yumuşaklık izin verdiğinde derin bir sadakat açığa çıkar.",
    rising: "İlk izlenimin olgun, ciddi ve güvenilirdir. Yaşından büyük durabilirsin. İnsanlar senden omurga ve istikrar bekler."
  },
  aquarius: {
    key: "aquarius",
    label: "Kova",
    glyph: "♒",
    element: "air",
    modality: "fixed",
    ruler: "Uranüs",
    keywords: ["özgünlük", "vizyon", "topluluk"],
    sun: "Sürüden ayrılmak senin için bir kapris değil ihtiyaçtır. Geleceği, sistemi ve arkadaşlığı yeniden tasarlamak istersin. Farklı olmak, ait olmaktan daha dürüst gelebilir.",
    moon: "Duygularını zihinle soğutur, mesafe alarak korunursun. Yakınlık bazen boğucu gelir; idealler ve özgürlük alanı kalbini açar.",
    rising: "İlk izlenimin sıra dışı, zeki ve biraz mesafelidir. Havan çağın ilerisinden gelir. İnsanlar sende hem arkadaş hem yabancı hissi bulur."
  },
  pisces: {
    key: "pisces",
    label: "Balık",
    glyph: "♓",
    element: "water",
    modality: "mutable",
    ruler: "Neptün",
    keywords: ["sezgi", "şefkat", "hayal"],
    sun: "Sınırlar senin için geçirgendir. Sanat, şefkat ve görünmeyen dünyalar seni çağırır. Başkasının hissini kendi hissin sanmamak, en önemli ustalığın olabilir.",
    moon: "Duygusal sünger gibisin. Müzik, rüya ve sessizlik seni onarır. Kaos artınca kaçış veya fedakârlık başlar; sınır koydukça sihrin berraklaşır.",
    rising: "İlk izlenimin yumuşak, hayalî ve merhametlidir. Bakışın başka bir odaya açılır. İnsanlar yanında daha az yalnız kalır."
  }
}

export const ELEMENT_LABELS: Record<ElementKey, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su"
}

export const ELEMENT_COPY: Record<ElementKey, string> = {
  fire: "Baskın ateş, hayatı bir kıvılcım gibi yaşadığını gösterir. İlham, cesaret ve görünürlük senin yakıtındır. Tükenmemek için ritme ve dinlenmeye ihtiyaç duyarsın.",
  earth: "Baskın toprak, somut sonuç ve güven arayışını öne çıkarır. Emekle inşa etmek doğal gelir. Esneklik öğrendikçe bereketin artar.",
  air: "Baskın hava, zihin ve ilişki ağının merkezde olduğunu söyler. Fikirler seni besler. Bedene ve hissin ağırlığına inmek dengeyi getirir.",
  water: "Baskın su, sezgi ve bağ derinliğini öne çıkarır. Hissetmeden karar vermek zor gelir. Sınır ve form, şefkatinin boşa akmasını engeller."
}

export const HOUSE_THEMES = [
  "Kimlik, beden ve ilk izlenim",
  "Para, yetenek ve öz değer",
  "İletişim, öğrenme ve yakın çevre",
  "Yuva, aile ve kökler",
  "Yaratıcılık, keyif ve kalp işleri",
  "İş, sağlık ve günlük ritim",
  "İlişkiler, evlilik ve öteki",
  "Dönüşüm, ortak kaynak ve derinlik",
  "İnanç, uzaklar ve anlam",
  "Kariyer, statü ve yaşam amacı",
  "Topluluk, dostluk ve gelecek hayalleri",
  "Bilinçaltı, inziva ve görünmeyen emeğin"
]

export const PLANET_META: Record<string, { label: string; glyph: string }> = {
  sun: { label: "Güneş", glyph: "☉" },
  moon: { label: "Ay", glyph: "☽" },
  mercury: { label: "Merkür", glyph: "☿" },
  venus: { label: "Venüs", glyph: "♀" },
  mars: { label: "Mars", glyph: "♂" },
  jupiter: { label: "Jüpiter", glyph: "♃" },
  saturn: { label: "Satürn", glyph: "♄" },
  uranus: { label: "Uranüs", glyph: "♅" },
  neptune: { label: "Neptün", glyph: "♆" },
  pluto: { label: "Plüton", glyph: "♇" },
  chiron: { label: "Kiron", glyph: "⚷" },
  northnode: { label: "Kuzey Ay Düğümü", glyph: "☊" },
  southnode: { label: "Güney Ay Düğümü", glyph: "☋" },
  lilith: { label: "Lilith", glyph: "⚸" },
  ascendant: { label: "Yükselen", glyph: "ASC" },
  midheaven: { label: "MC", glyph: "MC" }
}

export const SIGN_FROM_LABEL: Record<string, SignKey> = {
  aries: "aries",
  taurus: "taurus",
  gemini: "gemini",
  cancer: "cancer",
  leo: "leo",
  virgo: "virgo",
  libra: "libra",
  scorpio: "scorpio",
  sagittarius: "sagittarius",
  capricorn: "capricorn",
  aquarius: "aquarius",
  pisces: "pisces",
  koç: "aries",
  boğa: "taurus",
  ikizler: "gemini",
  yengeç: "cancer",
  aslan: "leo",
  başak: "virgo",
  terazi: "libra",
  akrep: "scorpio",
  yay: "sagittarius",
  oğlak: "capricorn",
  kova: "aquarius",
  balık: "pisces"
}

export const signColor = (sign: SignKey) => {
  const element = SIGNS[sign].element
  if (element === "fire") return "#f0a36b"
  if (element === "earth") return "#c5d48a"
  if (element === "air") return "#9ec7f0"
  return "#8bb8e8"
}

export const resolveSignKey = (value: string | undefined): SignKey => {
  if (!value) return "aries"
  const normalized = value.toLowerCase().replace(/\s+/g, "")
  return SIGN_FROM_LABEL[normalized] ?? (SIGN_ORDER.includes(normalized as SignKey) ? (normalized as SignKey) : "aries")
}
