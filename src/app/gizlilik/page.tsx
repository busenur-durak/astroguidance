import type { Metadata } from "next"
import { MERCHANT } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK"
}

const GizlilikPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Yasal</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Gizlilik ve KVKK</h1>
      <div className="mt-8 space-y-5 leading-7 text-muted">
        <p>
          {MERCHANT.brand}, doğum tarihi, saati, yeri ve hesap bilgilerini yalnızca natal harita
          üretmek, raporu açmak ve ödemeyi tamamlamak için işler. Veri vitrin, reklam ağı veya
          üçüncü kişi satışı için kullanılmaz.
        </p>
        <p>
          Saklananlar: ad, e-posta, şifre özeti, doğum verisi, harita sonucu, satın alınan raporlar
          ve ödeme kaydı. Kart numarası bizde tutulmaz; tahsilatı Iyzico yapar.
        </p>
        <p>
          Hakların: bilgi alma, düzeltme, silme, işlemeyi kısıtlama. Talepler için {MERCHANT.email}.
          Hesabı kapatırsan harita ve sipariş kayıtların silinir.
        </p>
        <p>Çerez: oturum (giriş) için zorunlu çerez kullanılır. Pazarlama çerezi yoktur.</p>
      </div>
    </div>
  )
}

export default GizlilikPage
