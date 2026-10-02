import type { Metadata } from "next"
import { MERCHANT } from "@/lib/legal"

export const metadata: Metadata = {
  title: "İletişim"
}

const IletisimPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">İletişim</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Bize yaz</h1>
      <div className="mt-8 space-y-5 leading-7 text-muted">
        <p>
          {MERCHANT.brand} — natal okuma atölyesi. {MERCHANT.city}, {MERCHANT.country}.
        </p>
        <p>
          Destek:{" "}
          <a className="text-gold-soft underline-offset-4 hover:underline" href={`mailto:${MERCHANT.email}`}>
            {MERCHANT.email}
          </a>
        </p>
        <p>Ödeme, rapor açılmama ve hesap için sipariş numaranı ve kayıtlı e-postanı yaz.</p>
      </div>
    </div>
  )
}

export default IletisimPage
