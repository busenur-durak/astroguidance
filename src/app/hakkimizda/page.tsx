import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Yöntem ve vizyon"
}

const HakkimizdaPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Atölye</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Vizyon</h1>
      <div className="mt-8 space-y-6 text-lg leading-8 text-muted">
        <p>
          AstroGuidance, natal astrolojiyi ciddiyetle ele alan bir okuma atölyesidir. Amaç burç
          köşesi üretmek değil; doğum anındaki gökyüzünü ilişki, meslek ve zamanlama için işe
          yarar bir dile çevirmektir.
        </p>
        <p>
          Her harita tropikal zodyak ve Placidus ev sistemiyle hesaplanır. Güneş kimliği, Ay
          duygusal ihtiyacı, Yükselen ilk izlenimi, 7. ev ilişki kapısını, 10. ev kamusal yolu
          gösterir. Yorum bu iskeletin üzerine kurulur.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-gold-soft">Nasıl çalışırız</h2>
        <ul className="mt-5 space-y-4 text-muted">
          <li>
            <strong className="text-ink">Hassas veri.</strong> Şehir koordinata, yerel saat evrensel
            zamana çevrilir. Saat yoksa Yükselen kayar; bunu açık söyleriz.
          </li>
          <li>
            <strong className="text-ink">Klasik iskelet.</strong> Gezegenler, evler ve element
            dengesi önce masaya gelir; sonra ilişki, meslek ve dönem okunur.
          </li>
          <li>
            <strong className="text-ink">Hüküm, süs değil.</strong> Raporlar “belki bir şeyler
            olur” diye bitmez. Uyumlu burç, meslek, ortam ve net tarih pencereleri vardır.
          </li>
          <li>
            <strong className="text-ink">Gizlilik.</strong> Doğum verisi ve raporlar hesabında
            kalır; vitrin malzemesi olmaz.
          </li>
        </ul>
      </section>

      <section className="mt-12 rounded-3xl border border-line bg-night-soft/70 p-6">
        <h2 className="font-display text-2xl text-gold-soft">Sınır</h2>
        <p className="mt-3 leading-7 text-muted">
          Astroloji tıbbi, hukuki veya finansal tavsiye yerine geçmez. Karar senindir; harita
          eğilimi ve zamanı gösterir. Doğru saat, doğru şehir — okumanın kalitesi buradan başlar.
        </p>
      </section>

      <Link
        href="/harita"
        className="mt-10 inline-flex rounded-full bg-gold px-6 py-3 font-medium text-night focus-visible:outline-2 focus-visible:outline-gold"
      >
        Natal özetini çıkar
      </Link>
    </div>
  )
}

export default HakkimizdaPage
