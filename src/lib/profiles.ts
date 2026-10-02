import type { SignKey } from "@/lib/types"

export type LoveProfile = {
  need: string
  feelings: string[]
  matches: string[]
  gifts: string[]
  traps: string[]
  howToLove: string[]
  doThis: string[]
}

export type CareerProfile = {
  talents: string[]
  jobs: string[]
  rooms: string[]
  outlook: string
  focus: string[]
  money: string
  steps: string[]
}

export const LOVE: Record<SignKey, LoveProfile> = {
  aries: {
    need: "İlişkide durağanlık değil hareket, netlik ve seninle aynı tempoda yürüyen biri gerekir. Sevilmekten çok birlikte bir şey başlatmak seni bağlar.",
    feelings: ["heyecan", "dürüst öfke", "özgürlük", "oyun", "görülme"],
    matches: ["Koç", "Aslan", "Yay", "İkizler", "Kova"],
    gifts: ["cesur başlangıç", "dürüstlük", "koruyucu ateş", "sıkılınca bile çözüm arama"],
    traps: ["acele bağ", "kıskançlığı savaş sanmak", "dinlemeyi unutmak", "soğuyunca ortadan kaybolmak"],
    howToLove: [
      "Partnerine 'seni seçiyorum'u her gün küçük bir hareketle göster.",
      "Tartışmada kazanmaya değil, netleşmeye oyna.",
      "Yalnız kalma ihtiyacını suçluluk olmadan söyle."
    ],
    doThis: [
      "İlk 3 ayda gelecek planı dayatma; tempo tutsun.",
      "Öfkeni 20 dakika yürüyüşle boşalt, sonra konuş.",
      "Sana yavaş gelen birini 'az seviyor' diye eleme."
    ]
  },
  taurus: {
    need: "Güven, dokunuş, düzenli bir birliktelik ve somut sadakat senin oksijenin. Söz değil, tekrarlanan davranış bağlar.",
    feelings: ["huzur", "duyusal yakınlık", "sadakat", "yavaş ısınma", "maddi güvenlik"],
    matches: ["Boğa", "Başak", "Oğlak", "Yengeç", "Balık"],
    gifts: ["sadık duruş", "bedensel şefkat", "istikrar", "evi güzelleştirme"],
    traps: ["değişime kilitlenmek", "kıskanç sahiplenme", "incinince susmak", "konfor için yanlış ilişkide kalmak"],
    howToLove: [
      "İhtiyacını 'ben böyleyim' diye değil, ricayla söyle.",
      "Partnerinin temposuna bir adım yer aç.",
      "Para ve ev konularını erken, sakin konuş."
    ],
    doThis: [
      "Haftada bir paylaşılmamış bir zevk (yemek, müzik, yürüyüş) koy.",
      "Kırıldığın şeyi 48 saat içinde cümleye dök.",
      "Seni acele ettiren bağlardan mesafe al."
    ]
  },
  gemini: {
    need: "Konuşulan, gülünen, zihni besleyen bir bağ şart. Sessiz ve tekdüze ilişki seni çabuk soldurur.",
    feelings: ["merak", "espri", "hafiflik", "çeşitlilik", "zihinsel yakınlık"],
    matches: ["İkizler", "Terazi", "Kova", "Koç", "Aslan"],
    gifts: ["sohbetle onarma", "esneklik", "oyun", "duyguları kelimeye çevirme"],
    traps: ["kaçış olarak flört", "iki seçenek arasında asılı kalmak", "derinleşmeden sıkılmak", "sözü tutmamak"],
    howToLove: [
      "Her gün 15 dakika telefonu bırakıp gerçek sohbet et.",
      "Kararsızlığını 'seni seçmiyorum' diye değil, 'düşünüyorum' diye çevir.",
      "Tek kişide birden fazla dünya keşfetmeye izin ver."
    ],
    doThis: [
      "Ciddi ilişki istiyorsan haftada bir planı sabitle.",
      "Mesajla biten tartışmayı yüz yüze tamamla.",
      "Merakını kıskançlıkla karıştırma; sor, varsayma."
    ]
  },
  cancer: {
    need: "Yuva hissi, duygusal güvenlik ve 'ben seninim' netliği olmadan kalbin açılmaz. Bakım görmek kadar bakım vermek de sevgindir.",
    feelings: ["aidiyet", "şefkat", "hatırlanmak", "korunmak", "aile sıcaklığı"],
    matches: ["Yengeç", "Akrep", "Balık", "Boğa", "Oğlak"],
    gifts: ["derin empati", "sadık bellek", "yuva kurma", "sezgisel bakım"],
    traps: ["pasif kırgınlık", "geçmişi bugüne taşımak", "aşırı koruma", "reddedilme korkusuyla test etmek"],
    howToLove: [
      "Kırıldığın anı hikâyeleştirmeden tek cümleyle söyle.",
      "Partnerine alan bırak; yakınlık boğmak değildir.",
      "Aile ve geçmiş yükünü ilişkinin ortasına koymadan paylaş."
    ],
    doThis: [
      "Ayda bir 'nasıl güvende hissederim' listesini güncelle.",
      "Suskunluğu ceza gibi kullanma.",
      "Seni evinde hissettiren ritüeller kur (yemek, gece sohbeti)."
    ]
  },
  leo: {
    need: "Görülmek, özel hissetmek ve cömertçe sevilmek. Alkışsız ilişki senin için soğuk bir oda gibidir.",
    feelings: ["gurur", "romantik sahne", "sadakat", "oyun", "takdir"],
    matches: ["Koç", "Aslan", "Yay", "İkizler", "Terazi"],
    gifts: ["cömert kalp", "sadık bağlılık", "ilişkiye ışık katma", "cesur ifade"],
    traps: ["onur kırılınca kapı çarpmak", "drama ile ilgi aramak", "kıskançlığı aşk sanmak", "eşitliği unutmak"],
    howToLove: [
      "Partnerini de sahneye çıkar; tek yıldız olma.",
      "Övgüyü beklemek yerine isteğini söyle.",
      "Kırıldığında tiyatro değil, net cümle kullan."
    ],
    doThis: [
      "Haftada bir küçük jestle 'sen benim için özel'sin' de.",
      "Tartışmayı seyirciye taşıma.",
      "Seni küçümseyen bağlardan hızla çık."
    ]
  },
  virgo: {
    need: "Özen, düzen, işe yarar sevgi. Sözlerden çok 'hayatımı kolaylaştırıyor' hissi bağlar.",
    feelings: ["huzur", "netlik", "hizmet", "sakin ritim", "güvenilirlik"],
    matches: ["Boğa", "Başak", "Oğlak", "Yengeç", "Akrep"],
    gifts: ["dikkat", "pratik şefkat", "sadakat", "sorunu çözme"],
    traps: ["eleştiriyi sevgi sanmak", "kusur avcılığı", "kendini yeterince iyi hissetmemek", "duyguyu ertelemek"],
    howToLove: [
      "Düzeltmeden önce bir cümle takdir et.",
      "Mükemmel partner arama; iyi niyetli ve istikrarlı olanı gör.",
      "Bedensel ve duygusal bakımı 'iş' gibi değil, bağ gibi yaşa."
    ],
    doThis: [
      "Günde bir kez eleştirisiz yakınlık koy.",
      "Kaygını listeden önce dokunuşla yumuşat.",
      "Partnerinin temposunu 'yanlış' diye yargılama."
    ]
  },
  libra: {
    need: "Güzellik, adalet ve eşit bir 'biz'. Tek taraflı emek seni sessizce zehirler.",
    feelings: ["uyum", "zarafet", "karşılıklılık", "romantizm", "barış"],
    matches: ["İkizler", "Terazi", "Kova", "Aslan", "Yay"],
    gifts: ["diplomasi", "estetik", "adil duruş", "ilişkiyi onarma"],
    traps: ["kararsızlık", "çatışmadan kaçış", "kendini kaybetme", "görüntü için kalmak"],
    howToLove: [
      "Hayır demeyi ilişkiyi bozmak değil, korumak say.",
      "Güzellik kadar hakikat de iste.",
      "Kararı erteleme; 7 gün kuralı koy."
    ],
    doThis: [
      "İhtiyaç listeni yazılı tut, partnerinle paylaş.",
      "Barış uğruna yutma; sonra hesap çıkarma.",
      "Seni sürekli kararsız bırakan bağdan çık."
    ]
  },
  scorpio: {
    need: "Derinlik, sadakat ve sırların emanet edileceği bir bağ. Yüzeysel ilişki seni aç bırakır.",
    feelings: ["yoğunluk", "güven", "tutku", "dönüşüm", "sahiplenilme (sağlıklı dozda)"],
    matches: ["Yengeç", "Akrep", "Balık", "Boğa", "Oğlak"],
    gifts: ["sarsılmaz bağlılık", "dürüst derinlik", "krizde durabilme", "şifa"],
    traps: ["test etmek", "kıskanç kontrol", "intikam", "ya hep ya hiç"],
    howToLove: [
      "Şüpheyi soruya çevir, soruşturmaya değil.",
      "Güveni hak ederek iste, dayatarak değil.",
      "Kırılganlığını güçsüzlük sanma."
    ],
    doThis: [
      "İlk güven kırığında konuş, biriktirme.",
      "Eski ilişki hikâyesini yeni bağın yatağına taşıma.",
      "Partnerine alan bırak; yakınlık boğmak değildir."
    ]
  },
  sagittarius: {
    need: "Özgürlük, anlam ve birlikte büyüme. Kafes gibi hissettiren ilişki soluğunu keser.",
    feelings: ["umut", "macera", "dürüstlük", "neşe", "ufuk"],
    matches: ["Koç", "Aslan", "Yay", "Terazi", "Kova"],
    gifts: ["içtenlik", "neşe katma", "büyük resmi görme", "affedicilik"],
    traps: ["kaçış", "sözü uçurma", "bağlanınca boğulmak", "eleştiriyi vaaz gibi vermek"],
    howToLove: [
      "Özgürlüğü 'ben yokum' diye değil, 'dönüyorum' diye yaşa.",
      "Gelecek hayalini partnerinle ortak yaz.",
      "Sert doğruyu yumuşak cümleyle söyle."
    ],
    doThis: [
      "Birlikte bir yol / öğrenme planı koy.",
      "Sıkılınca yeni insan değil, yeni ritim dene.",
      "Söz verdiğin tarihi tut."
    ]
  },
  capricorn: {
    need: "Ciddiyet, saygı ve zamanla inşa edilen güven. Oyun gibi başlayan ama omurgasız kalan bağ seni yorar.",
    feelings: ["saygı", "istikrar", "gurur", "sorumluluk", "yavaş ama kalıcı sevgi"],
    matches: ["Boğa", "Başak", "Oğlak", "Akrep", "Balık"],
    gifts: ["güvenilir omurga", "uzun vade", "koruyuculuk", "somut emek"],
    traps: ["duyguyu ertelemek", "işe kaçmak", "soğuk görünmek", "kontrol"],
    howToLove: [
      "Yeterliliğini kanıtlamak yerine yumuşaklığını göster.",
      "Partnerini proje gibi yönetme.",
      "Başarı kadar şefkati de evin parçası yap."
    ],
    doThis: [
      "Haftada bir iş konuşulmayan akşam koy.",
      "Sevgini somut jestle göster (plan, destek, süre).",
      "Seni küçümseyen bağda kalma; saygı kırmızı çizgin."
    ]
  },
  aquarius: {
    need: "Arkadaşlık zeminli, özgür ve zihinle tutulan bir bağ. Yapışkan yakınlık seni kaçırır; ideali olmayan bağ da soğutur.",
    feelings: ["özgürlük", "dostluk", "fikir paylaşımı", "mesafe + yakınlık dengesi", "orijinallik"],
    matches: ["İkizler", "Terazi", "Kova", "Koç", "Yay"],
    gifts: ["sadık dostluk", "yargılamadan dinleme", "ileri görüş", "eşitlik"],
    traps: ["duygudan kopmak", "aşırı mesafe", "ilişkiyi teoriye çevirmek", "ani soğuma"],
    howToLove: [
      "Hissettiğini fikir gibi değil, his gibi söyle.",
      "Yakınlık için ritüel koy; sadece sohbet yetmez.",
      "Farklılığını silah gibi kullanma."
    ],
    doThis: [
      "Haftada bir kalp konuşması (sadece gündem değil).",
      "Ani uzaklaşmadan önce 'alan istiyorum' de.",
      "Seni sıradanlaştıran bağda kalma."
    ]
  },
  pisces: {
    need: "Şefkat, ruhsal yakınlık ve sınırları eriten ama boğmayan bir bağ. Sert ve fazla gerçekçi ilişki seni kurutur.",
    feelings: ["merhamet", "hayal", "birleşme", "müzik/sanat", "sessiz anlaşılma"],
    matches: ["Yengeç", "Akrep", "Balık", "Boğa", "Oğlak"],
    gifts: ["koşulsuz şefkat", "sezgi", "affedicilik", "romantik dünya kurma"],
    traps: ["fedakârlıkta kaybolmak", "kaçış", "sınır koymamak", "ideali gerçek sanmak"],
    howToLove: [
      "Sevgiyi kendini silerek değil, durarak ver.",
      "Sisli vaatlere değil, tekrarlanan eyleme bak.",
      "Hayır demeyi partnerini üzmek sanma."
    ],
    doThis: [
      "Ayda bir kendi sınır listeni yaz.",
      "Kaçış (dizi, rüya, başkası) yerine konuş.",
      "Seni sürekli kurtarman gereken bağı bırak."
    ]
  }
}

export const CAREER: Record<SignKey, CareerProfile> = {
  aries: {
    talents: ["öncülük", "hızlı karar", "kriz yönetimi", "satış ve sahne", "yeni iş kurma"],
    jobs: ["girişimci", "satış yöneticisi", "spor / antrenörlük", "acil durum / saha", "ürün lansmanı", "askeri veya güvenlik liderliği"],
    rooms: ["tempo yüksek ekipler", "hedef net işler", "rekabet olan ama adil ortamlar", "bürokrasisi az yapılar"],
    outlook: "Kariyerin durursa söner, hareket ederse parlar. İlk 10 yıl sıçrama, sonra liderlik. Durağan kurumlarda mutsuz olur, kendi işinde veya öncü rollerde yükselirsin.",
    focus: ["tek hedefe kilitlenmek", "öfkeyi yönetmek", "bitirmeden yeni iş açmamak", "ekiple kazanmayı öğrenmek"],
    money: "Para, cesur teklif ve görünür başarıdan gelir. Sabırsızlık maliyeti artırır; komisyon + proje modeli sana uyar.",
    steps: ["90 günlük tek bir görünür hedef koy.", "Her hafta bir soğuk kapı / teklif yap.", "Ortağı veya mentörü olan işleri tercih et."]
  },
  taurus: {
    talents: ["istikrar", "estetik + para hissi", "müzakere", "kaliteli üretim", "sabır"],
    jobs: ["finans / yatırım", "gayrimenkul", "tasarım ve marka", "şef / gıda", "lüks perakende", "müzik ve sanat yönetimi"],
    rooms: ["sakin, kaliteli ofisler", "uzun vadeli şirketler", "elle tutulur ürün", "güven veren hiyerarşi"],
    outlook: "Kariyerin yavaş ısınır, sonra zor sarsılır. 30'lardan sonra tavan yükselir. Aceleye gelmez; doğru yerde servet biriktirirsin.",
    focus: ["değişime esneme", "fiyatını net koyma", "konfor alanından kontrollü çıkış", "dijital beceriler"],
    money: "Birikim ve somut varlık senin dilin. Spekülasyon değil, düzenli gelir + mülk / marka.",
    steps: ["Gelirinin %15'ini otomatik ayır.", "Portföyünü tek işverene bağlama.", "Kaliteyi sat, ucuzluğu değil."]
  },
  gemini: {
    talents: ["iletişim", "öğrenme hızı", "ağ kurma", "çok işi çevirme", "hikâye anlatma"],
    jobs: ["yazar / editör", "pazarlama", "öğretmenlik", "medya", "satış", "çeviri", "topluluk yönetimi"],
    rooms: ["hareketli ofisler", "uzaktan + saha karışımı", "fikir üretilen ekipler", "sıkıcı prosedürü az yerler"],
    outlook: "Tek yola kilitlenirsen sıkılırsın; portföy kariyer (2-3 hat) sana uyar. İletişimle para kazanırsın, sessiz masada erirsin.",
    focus: ["bitirme disiplini", "tek uzmanlık seçmek", "dağınıklığı sisteme bağlamak", "sözünü tutmak"],
    money: "Kelime, ağ ve bilgi satışı. Freelance + maaş hibriti iyi durur.",
    steps: ["Bir niş seç, 6 ay sadece onu büyüt.", "Haftalık teslim takvimi tut.", "Görünür içerik üret (yazı, konuşma)."]
  },
  cancer: {
    talents: ["insan okuma", "bakım", "hafıza / arşiv", "yuva ve marka hissi", "sadık müşteri"],
    jobs: ["insan kaynakları", "psikoloji / danışmanlık", "eğitim", "gıda ve ev markaları", "emlak", "sağlık bakımı", "içerik ve bellek işleri"],
    rooms: ["güvenli, insani ekipler", "aile şirketi veya sıcak kültür", "uzaktan ama bağlı ekipler", "bakım odaklı kurumlar"],
    outlook: "Kariyerin aidiyet bulunca yükselir. Soğuk kurumlarda küçülürsün. 28-35 arası meslek kimliğin oturur; sonrası istikrarlı tırmanış.",
    focus: ["sınır koymak", "işe ev duygusunu fazla taşırmamak", "görünür olmak", "duygusal yorgunluğu yönetmek"],
    money: "Güven ve tekrarlayan müşteri gelir getirir. Spekülatif iş stresi yükseltir.",
    steps: ["Referans ve sadık çevre üzerinden ilerle.", "Portföyüne 'insan işi'ni yaz.", "Ayda bir görünür bir iş çıkar."]
  },
  leo: {
    talents: ["sahne", "liderlik", "marka", "ilham", "yönetim ve temsil"],
    jobs: ["yöneticilik", "sahne / içerik", "eğitimci", "girişim", "halkla ilişkiler", "lüks ve yaratıcı yönlendirme"],
    rooms: ["görünür roller", "alkışın olduğu sahneler", "yaratıcı stüdyolar", "senin imzanın durduğu işler"],
    outlook: "Kariyerin görünürlükle büyür. Arkada kalan işte söner, önde durunca parlar. 30'lardan sonra otoriten artar.",
    focus: ["egoyu ekiple dengelemek", "eleştiriyi kişisel almama", "devamlı üretim", "parayı sadece prestije bağlamama"],
    money: "İsim ve sahne parası. Telif, bonus, kendi markan. Gizli emek modelinde eksik kalırsın.",
    steps: ["Kişisel markanı 90 günde netleştir.", "Her ay bir görünür iş yayınla.", "Ekibine kredi ver, tek başına taşıma."]
  },
  virgo: {
    talents: ["analiz", "iyileştirme", "detay", "hizmet tasarımı", "kalite"],
    jobs: ["analiz / data", "sağlık", "editörlük", "operasyon", "kalite", "yazılım test", "danışmanlık", "beslenme"],
    rooms: ["düzenli sistemler", "uzman ekipler", "sessiz derin iş", "işe yarar ürünler"],
    outlook: "Kariyerin ustalıkla yükselir. İlk yıllar çıraklık, sonra vazgeçilmezlik. Mükemmeliyet tavanı yavaşlatır; 'yeterince iyi' teslimat seni büyütür.",
    focus: ["bitirmeyi öğrenmek", "görünürlük", "fiyatını yükseltmek", "kendini eleştirmeyi azaltmak"],
    money: "Uzmanlık ücreti. Saat satma, paket sat. Mükemmel işi ucuza verme.",
    steps: ["Bir nişte 'en düzenli' ol.", "Aylık vaka / portföy çıkar.", "Fiyatını yılda iki kez gözden geçir."]
  },
  libra: {
    talents: ["müzakere", "estetik", "ilişki yönetimi", "hukukî denge", "marka zevki"],
    jobs: ["hukuk / arabuluculuk", "tasarım", "İK", "satış ortaklığı", "sanat ve moda", "diplomasi / kurumsal iletişim"],
    rooms: ["zarif ofisler", "çift yönlü ilişkiler", "estetik standartı yüksek yerler", "adaletin konuşulduğu ekipler"],
    outlook: "Kariyerin ilişki ve zevkle büyür. Tek başına teknik işte sönük kalırsın; insan + güzellik olan yerde yükselirsin.",
    focus: ["karar hızı", "herkesi memnun etmeyi bırakmak", "kendi imzanı koymak", "çatışmadan kaçmamak"],
    money: "Ortaklık, komisyon, tasarım ve hukukî zeka. Dengesiz iş ortaklarından uzak dur.",
    steps: ["Portföyünü görsel olarak kur.", "Bir niş müşteri tipi seç.", "Sözleşmeyi duygudan önce yaz."]
  },
  scorpio: {
    talents: ["araştırma", "kriz", "psikoloji", "strateji", "dönüştürme"],
    jobs: ["araştırmacı", "finans / risk", "psikoloji", "siber güvenlik", "cerrahi / yoğun bakım", "soruşturma", "yatırım"],
    rooms: ["az ama derin ekipler", "gizlilik isteyen işler", "yüksek stakes", "yüzeysel işlerin olmadığı yerler"],
    outlook: "Kariyerin kriz ve derinlikle sıçrar. Sığ işlerde ölürsün. 35 sonrası güç ve para belirginleşir; sır tutan roller sana gelir.",
    focus: ["güven paylaşımı", "tek başına her şeyi kontrol etmemek", "tükenmişliği yönetmek", "görünür itibar"],
    money: "Derin uzmanlık ve kriz primi. Ortak kaynak, yatırım, danışmanlık.",
    steps: ["Bir 'zor problem' nişi seç.", "Sessiz networking yap (güvenilir 10 kişi).", "Yılda bir büyük dönüşüm projesi bitir."]
  },
  sagittarius: {
    talents: ["öğretme", "ufuk", "satış", "yayın", "uluslararası iş"],
    jobs: ["eğitim", "yayıncılık", "turizm", "ihracat", "hukuk / felsefe", "koçluk", "içerik ve seyahat işleri"],
    rooms: ["sınırları açık işler", "öğrenilen yerler", "seyahat / uzak pazar", "dogması az kültürler"],
    outlook: "Kariyerin ufuk açılınca büyür. Dar odada küçülürsün. 30'larda yurtdışı veya öğretim hattı açılırsa tavan yükselir.",
    focus: ["odak", "vaadi tutmak", "tek uzmanlık", "dağılmamak"],
    money: "Bilgi, yayın, uluslararası komisyon. Tek maaş seni boğabilir; telif + eğitim paketi iyi durur.",
    steps: ["Bir konu seç, onu öğret.", "Yılda bir yurtdışı / yeni pazar dene.", "Sözleşmeli işleri 'belki' ile bırakma."]
  },
  capricorn: {
    talents: ["yapı", "yönetim", "sorumluluk", "uzun vade", "itibar"],
    jobs: ["yöneticilik", "mühendislik", "kamu / kurumsal", "mimarlık", "finans yönetimi", "girişim operasyonu"],
    rooms: ["ciddi kurumlar", "net hiyerarşi", "sonuç ölçülen yerler", "itibarlı markalar"],
    outlook: "Kariyerin merdivenle çıkar, asansörle değil. 28-40 arası en dik tırmanış. Yaş ilerledikçe otoriten artar; erken yaşta 'yavaş' görünür, sonra geçer.",
    focus: ["esnemek", "delegasyon", "hayatı sadece işe yememek", "riski hesaplı almak"],
    money: "Unvan, maaş basamağı, şirket hissesi. Sabırlı birikim. Kumar değil, yapı.",
    steps: ["5 yıllık unvan haritası yaz.", "Her yıl bir somut yetkinlik ekle.", "Görünür başarıyı dosyala (terfi kanıtı)."]
  },
  aquarius: {
    talents: ["sistem", "inovasyon", "topluluk", "teknoloji", "reform"],
    jobs: ["yazılım / ürün", "sosyal girişim", "bilim", "STK", "strateji", "topluluk ve platform işleri"],
    rooms: ["esnek, eşitlikçi ekipler", "uzaktan / hibrit", "gelecek konuşulan yerler", "kalıbı kıran stüdyolar"],
    outlook: "Kariyerin sıradışı yolda parlar. Klasik merdivende sıkılırsın. 30'lardan sonra kendi sistemini kurarsan tavan açılır.",
    focus: ["insan sıcaklığı", "bitirme", "tek başına devrim yapmamak", "geliri idealle dengelemek"],
    money: "Fikir ve platform. Hisse, ürün, topluluk. Sadece maaş seni boğabilir.",
    steps: ["Bir ürün / manifesto yayınla.", "Topluluğunu 100 kişiye çıkar.", "Gelir modelini ideolojiden ayrı yaz."]
  },
  pisces: {
    talents: ["sezgi", "sanat", "şefkat", "hikâye", "atmosfer"],
    jobs: ["sanat / müzik / film", "terapi", "tasarım", "ruhsal danışmanlık", "bakım", "marka hikâyesi", "deniz / otel / deneyim"],
    rooms: ["yumuşak, yaratıcı stüdyolar", "anlamı olan işler", "sert satışın olmadığı yerler", "esnek saat"],
    outlook: "Kariyerin ilham bulunca akar, anlam kaybolunca dağılır. 27-35 arası meslek ruhun oturur. Sert kurumlarda erir, yaratıcı veya şifa işinde büyürsün.",
    focus: ["sınır", "teslim tarihi", "kaçış yerine ritim", "emeğini ücretsiz dağıtmamak"],
    money: "Sanat, terapi, deneyim. Paket fiyat. 'İçimden geldi' diye bedava çalışma.",
    steps: ["Aylık teslim takvimi koy.", "Portföyünü duygusal değil, net sun.", "Sınırlı seans / proje sayısı belirle."]
  }
}

export const MATCH_BY_ELEMENT: Record<string, SignKey[]> = {
  fire: ["aries", "leo", "sagittarius", "gemini", "libra", "aquarius"],
  earth: ["taurus", "virgo", "capricorn", "cancer", "scorpio", "pisces"],
  air: ["gemini", "libra", "aquarius", "aries", "leo", "sagittarius"],
  water: ["cancer", "scorpio", "pisces", "taurus", "virgo", "capricorn"]
}
