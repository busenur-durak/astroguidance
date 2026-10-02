import Link from "next/link"

export const SiteFooter = () => {
  return (
    <footer className="border-t border-line bg-night/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-gold-soft">AstroGuidance</p>
          <p className="mt-2 leading-6">Natal okuma atölyesi. Tropikal zodyak, Placidus evler.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/harita">
            Natal özet
          </Link>
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/raporlar">
            Raporlar
          </Link>
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/hakkimizda">
            Yöntem
          </Link>
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/iletisim">
            İletişim
          </Link>
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/gizlilik">
            Gizlilik / KVKK
          </Link>
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/mesafeli-satis">
            Mesafeli satış
          </Link>
          <Link className="hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold" href="/iade">
            İade
          </Link>
        </div>
        <p className="leading-6">
          Astroloji tıbbi veya hukuki tavsiye değildir. Doğum saati net değilse Yükselen kayar.
        </p>
      </div>
    </footer>
  )
}
