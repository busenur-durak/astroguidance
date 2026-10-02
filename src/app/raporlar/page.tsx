import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Raporlar"
}

const products = [
  {
    title: "Natal özet",
    price: "Ücretsiz",
    items: ["Güneş, Ay, Yükselen", "12 ev ve gezegenler", "Karakter ve element"]
  },
  {
    title: "İlişki & Aşk",
    price: "69 TL",
    items: [
      "İlişkide asıl ihtiyacın",
      "Sana iyi gelen duygular",
      "Uyumlu burçlar",
      "Güçlü yanlar ve tuzaklar",
      "Partnerine nasıl davranmalısın"
    ]
  },
  {
    title: "Kariyer & Para",
    price: "69 TL",
    items: [
      "Doğal yetenekler",
      "Uygun meslekler",
      "İyi gelişeceğin ortamlar",
      "Kariyer eğilimi",
      "Somut adımlar"
    ]
  },
  {
    title: "Tarih pencereleri",
    price: "99 TL",
    items: [
      "Aşk ve evlilik — en iyi tarihler",
      "Aşk ve evlilik — en kötü tarihler",
      "Kariyer — en uygun tarihler",
      "Kariyer — en kötü dönemler",
      "Tüm hayat dönemleri, 2030 sınırı yok"
    ]
  },
  {
    title: "Uzman soru hakkı",
    price: "39 TL",
    items: ["3 soru / paket", "Haklar birikir", "Bitince tekrar alınır"]
  }
]

const RaporlarPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Okumalar</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Raporlar</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Aşk, kariyer ve tarih bu haritada bir kez alınır, açık kalır. Soru hakkı pakettir:
        her alışveriş 3 soru ekler, bitince veya bitmeden tekrar alınır.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.title} className="rounded-3xl border border-line bg-night-soft/80 p-6">
            <h2 className="font-display text-3xl text-gold-soft">{product.title}</h2>
            <p className="mt-2 text-2xl text-gold">{product.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {product.items.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <Link
        href="/harita"
        className="mt-10 inline-flex rounded-full bg-gold px-6 py-3 font-medium text-night focus-visible:outline-2 focus-visible:outline-gold"
      >
        Önce natal özeti çıkar
      </Link>
    </div>
  )
}

export default RaporlarPage
