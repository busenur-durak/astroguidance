import Link from "next/link"
import { ArrowRight, BookOpen, Compass, Heart, Shield, Sparkles } from "lucide-react"

const steps = [
  {
    title: "Doğum verisi",
    text: "Ad, tarih, saat ve şehir. Koordinat ve yerel saat arka planda netleşir."
  },
  {
    title: "Natal hesap",
    text: "Tropikal zodyak ve Placidus ev sistemiyle Güneş, Ay, Yükselen, gezegenler ve 12 ev."
  },
  {
    title: "Uzman okuma",
    text: "Semboller günlük dile çevrilir: karakter, ilişki, meslek ve dönem."
  },
  {
    title: "Karar desteği",
    text: "Ücretsiz iskelet; ilişki, kariyer ve takvim raporları isteğe bağlı açılır."
  }
]

const HomePage = () => {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="text-sm uppercase tracking-[0.28em] text-gold">Natal atölye</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-gold-soft sm:text-7xl">
          Haritanı ciddiye alan bir okuma.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          AstroGuidance, doğum anının gökyüzünü hesaplar ve bunu ilişki, meslek ve zamanlama için
          anlaşılır bir rehbere çevirir. Köşe yazısı değil; senin haritan.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/harita"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-night transition hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            Ücretsiz natal özet
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/raporlar"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-gold"
          >
            Raporları incele
          </Link>
        </div>
        <dl className="mt-12 grid gap-4 border-t border-line pt-8 text-sm text-muted sm:grid-cols-3">
          <div>
            <dt className="text-gold">Hesap standardı</dt>
            <dd className="mt-1">Tropikal zodyak · Placidus evler</dd>
          </div>
          <div>
            <dt className="text-gold">Veri</dt>
            <dd className="mt-1">Doğum saati ve şehir koordinatı zorunlu</dd>
          </div>
          <div>
            <dt className="text-gold">Gizlilik</dt>
            <dd className="mt-1">Harita yalnızca senin hesabında durur</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "Natal iskelet",
            text: "Güneş, Ay, Yükselen, 12 ev ve element dengesi — ücretsiz, dakikalar içinde."
          },
          {
            icon: Heart,
            title: "İlişki ve meslek",
            text: "Kime ısındığın, hangi iş ve ortamın sana yaradığı, ne yapman gerektiği."
          },
          {
            icon: Compass,
            title: "Zamanlama",
            text: "Aşk–evlilik ve kariyer için en iyi ve en kötü tarihler; yakın dönem ve tüm hayat."
          }
        ].map((item) => (
          <article key={item.title} className="rounded-3xl border border-line bg-night-soft/70 p-6">
            <item.icon className="h-5 w-5 text-gold" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl text-gold-soft">{item.title}</h2>
            <p className="mt-2 leading-7 text-muted">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-display text-4xl text-gold-soft">Yöntem</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-line bg-night/60 p-5">
              <span className="text-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-line bg-night-soft/70 p-6">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl text-gold-soft">Neden ücretli rapor?</h2>
            <p className="mt-3 leading-7 text-muted">
              Ücretsiz katman haritanın iskeletidir. Derin rapor; uyumlu burçlar, meslek listesi,
              ortam, tuzak ve net tarih pencereleri içerir. Genel burç yorumu değil, senin evlerin.
            </p>
          </article>
          <article className="rounded-3xl border border-line bg-night-soft/70 p-6">
            <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl text-gold-soft">Güven</h2>
            <p className="mt-3 leading-7 text-muted">
              Hesaplama doğum anına bağlıdır. Saat bilinmiyorsa öğlen 12:00 ile Yükselen kayar;
              mümkünse nüfus veya aile kaydından saati netleştir.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-6xl rounded-[2rem] border border-line bg-gradient-to-br from-violet-950/40 to-amber-950/20 px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gold">İlk adım ücretsiz</p>
            <h2 className="mt-2 max-w-xl font-display text-4xl text-gold-soft">
              Haritanı çıkar. Derinliği sen seç.
            </h2>
          </div>
          <Link
            href="/harita"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-medium text-night focus-visible:outline-2 focus-visible:outline-gold"
          >
            Başla
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
