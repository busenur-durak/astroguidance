import type { Metadata } from "next"
import { MERCHANT } from "@/lib/legal"

export const metadata: Metadata = {
  title: "İade ve iptal"
}

const IadePage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Yasal</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">İade ve iptal</h1>
      <div className="mt-8 space-y-5 leading-7 text-muted">
        <p>
          Rapor dijitaldir. Ödeme onaylanıp içerik açıldıktan sonra cayma / iade yoktur; metin
          okunmuş dijital üründür.
        </p>
        <p>
          Kart çekildi ama rapor açılmadıysa, çift çekim veya teknik hata varsa {MERCHANT.email}
          adresine sipariş numarası ve e-posta yaz. İnceleme sonrası iade Iyzico üzerinden aynı
          karta yapılır.
        </p>
        <p>Soru hakkı paketinde kullanılmamış haklar hesabında durur; paket iadesi yoktur.</p>
      </div>
    </div>
  )
}

export default IadePage
