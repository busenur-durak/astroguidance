import type { Metadata } from "next"
import { MERCHANT } from "@/lib/legal"
import { REPORT_CATALOG } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Mesafeli satış sözleşmesi"
}

const MesafeliPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Yasal</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Mesafeli satış sözleşmesi</h1>
      <div className="mt-8 space-y-5 leading-7 text-muted">
        <p>
          Satıcı: {MERCHANT.brand}, {MERCHANT.city}. İletişim: {MERCHANT.email}. Alıcı: ödeme
          formundaki ad, e-posta ve telefon.
        </p>
        <p>
          Konu: dijital natal rapor. Teslimat anlıktır; ödeme onayından sonra ilgili haritada
          açılır. Fiziksel kargo yoktur.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{REPORT_CATALOG.love.title} — {REPORT_CATALOG.love.priceLabel}</li>
          <li>{REPORT_CATALOG.career.title} — {REPORT_CATALOG.career.priceLabel}</li>
          <li>{REPORT_CATALOG.timing.title} — {REPORT_CATALOG.timing.priceLabel}</li>
          <li>{REPORT_CATALOG.ask.title} — {REPORT_CATALOG.ask.priceLabel} (3 soru, tekrar alınabilir)</li>
        </ul>
        <p>
          Ödeme Iyzico üzerinden kart / 3D Secure ile TRY cinsindendir. Sözleşme, ödemenin
          onaylanmasıyla kurulur.
        </p>
        <p>
          Dijital içerik teslimattan sonra cayma hakkına girmez (6502 sayılı Kanun md. 15/ğ). İade
          koşulları İade sayfasındadır.
        </p>
      </div>
    </div>
  )
}

export default MesafeliPage
