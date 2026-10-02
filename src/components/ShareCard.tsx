import { NatalWheel } from "@/components/NatalWheel"
import { ELEMENT_LABELS } from "@/lib/signs"
import type { NatalChartResult } from "@/lib/types"

type ShareCardProps = {
  chart: NatalChartResult
}

export const ShareCard = ({ chart }: ShareCardProps) => {
  return (
    <div
      id="share-card"
      className="w-[420px] max-w-full overflow-hidden rounded-[2rem] border border-gold/30 bg-[#0b0d24] p-6 text-ink shadow-[0_0_40px_rgba(228,195,106,0.15)]"
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-gold">AstroGuidance</p>
      <h3 className="mt-2 font-display text-3xl text-gold-soft">{chart.name}</h3>
      <p className="mt-1 text-xs text-muted">
        {chart.birthLabel} · {chart.placeLabel}
      </p>
      <div className="mx-auto mt-4 w-64">
        <NatalWheel rising={chart.rising} bodies={chart.bodies} houses={chart.houses} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {[chart.sun, chart.moon, chart.rising].map((item) => (
          <div key={item.key} className="rounded-2xl bg-white/5 px-2 py-3">
            <p className="text-[10px] uppercase tracking-wide text-muted">{item.label}</p>
            <p className="font-display text-lg text-gold-soft">
              {item.signGlyph} {item.signLabel}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Baskın element: {ELEMENT_LABELS[chart.elements.dominant]}
      </p>
    </div>
  )
}
