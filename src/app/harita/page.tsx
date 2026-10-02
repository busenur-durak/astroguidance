import type { Metadata } from "next"
import { Suspense } from "react"
import { ChartWorkspace } from "@/components/ChartWorkspace"

export const metadata: Metadata = {
  title: "Natal harita oluştur"
}

const HaritaPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Hesaplama</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Doğum haritan</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Saat ve şehir net olsun; Yükselen oradan doğar. Ücretsiz katman iskeleti gösterir. İlişki,
        meslek ve dönem raporları haritana işlenerek açılır.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-muted">Harita hazırlanıyor…</p>}>
          <ChartWorkspace />
        </Suspense>
      </div>
    </div>
  )
}

export default HaritaPage
