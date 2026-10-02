"use client"

import { useState } from "react"
import { CalendarRange, Download, Flame, FileText, ImageDown, Sparkles, Waves, Wind, Mountain } from "lucide-react"
import { NatalWheel } from "@/components/NatalWheel"
import { LockedReports } from "@/components/LockedReports"
import { ShareCard } from "@/components/ShareCard"
import { PdfReport } from "@/components/PdfReport"
import { AskPanel } from "@/components/AskPanel"
import { ELEMENT_LABELS } from "@/lib/signs"
import { downloadReportPdf, downloadSharePng } from "@/lib/exportReport"
import type { AskTurn, BirthInput, ElementKey, NatalChartResult, ReportId } from "@/lib/types"

type ChartResultProps = {
  chart: NatalChartResult
  chartId: string | null
  birth: BirthInput | null
  unlocked: string[]
  askLimit: number
  asks: AskTurn[]
  onUnlocked: (payload: { chartId: string; unlocked: string[]; askLimit?: number }) => void
  onAsks: (asks: AskTurn[]) => void
}

const ElementMark = ({ element }: { element: ElementKey }) => {
  if (element === "fire") return <Flame className="h-4 w-4" aria-hidden="true" />
  if (element === "earth") return <Mountain className="h-4 w-4" aria-hidden="true" />
  if (element === "air") return <Wind className="h-4 w-4" aria-hidden="true" />
  return <Waves className="h-4 w-4" aria-hidden="true" />
}

const toneClass = (tone: "luck" | "focus" | "caution") => {
  if (tone === "luck") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
  if (tone === "focus") return "border-sky-400/30 bg-sky-400/10 text-sky-200"
  return "border-amber-400/30 bg-amber-400/10 text-amber-200"
}

export const ChartResult = ({
  chart,
  chartId,
  birth,
  unlocked,
  askLimit,
  asks,
  onUnlocked,
  onAsks
}: ChartResultProps) => {
  const [exportError, setExportError] = useState("")
  const [showCard, setShowCard] = useState(false)
  const [checkoutId, setCheckoutId] = useState<ReportId | null>(null)

  const handlePng = async () => {
    setExportError("")
    setShowCard(true)
    try {
      await downloadSharePng(chart.name)
    } catch {
      setExportError("Kart indirilemedi. Biraz sonra dene.")
    }
  }

  const handlePdf = async () => {
    setExportError("")
    try {
      await downloadReportPdf(chart.name)
    } catch {
      setExportError("PDF hazırlanamadı.")
    }
  }

  return (
    <section className="relative space-y-8">
      <PdfReport chart={chart} unlocked={unlocked} asks={asks} />
      <div className="relative rounded-3xl border border-line bg-night-soft/80 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Natal özet</p>
            <h2 className="font-display text-4xl text-gold-soft">{chart.name}</h2>
            <p className="mt-1 text-muted">
              {chart.birthLabel} · {chart.placeLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePng}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold"
            >
              <ImageDown className="h-4 w-4" aria-hidden="true" />
              Kart indir
            </button>
            <button
              type="button"
              onClick={handlePdf}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              PDF
            </button>
            <button
              type="button"
              onClick={() => setShowCard((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Kartı göster
            </button>
          </div>
        </div>
        {exportError && (
          <p className="mt-3 text-sm text-rose-300" role="alert">
            {exportError}
          </p>
        )}

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[420px_1fr]">
          <NatalWheel rising={chart.rising} bodies={chart.bodies} houses={chart.houses} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[chart.sun, chart.moon, chart.rising].map((item) => (
              <article key={item.key} className="rounded-2xl border border-line bg-night/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
                <p className="mt-2 font-display text-3xl text-gold-soft">
                  {item.signGlyph} {item.signLabel}
                </p>
                <p className="text-sm text-muted">
                  {item.formatted} · {item.house}. ev
                </p>
              </article>
            ))}
            <article className="rounded-2xl border border-line bg-night/70 p-4 sm:col-span-3">
              <p className="flex items-center gap-2 text-sm text-gold">
                <ElementMark element={chart.elements.dominant} />
                Baskın element: {ELEMENT_LABELS[chart.elements.dominant]}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                {(Object.keys(ELEMENT_LABELS) as ElementKey[]).map((key) => (
                  <div key={key} className="rounded-xl bg-white/5 py-2">
                    <p className="text-muted">{ELEMENT_LABELS[key]}</p>
                    <p className="text-lg text-ink">{chart.elements[key]}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
        {showCard ? (
          <div className="mt-8 flex justify-center">
            <ShareCard chart={chart} />
          </div>
        ) : (
          <div className="pointer-events-none absolute top-0 left-[-1200px]">
            <ShareCard chart={chart} />
          </div>
        )}
      </div>

      <article className="rounded-3xl border border-line bg-night-soft/80 p-6">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gold">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Ücretsiz karakter analizi
        </p>
        <h3 className="mt-2 font-display text-3xl text-gold-soft">{chart.analysis.title}</h3>
        <p className="mt-4 max-w-3xl leading-8 text-ink/90">{chart.analysis.summary}</p>
        <p className="mt-4 max-w-3xl leading-7 text-muted">{chart.analysis.elementsText}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {chart.analysis.strengths.map((item) => (
            <li key={item} className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-sm text-gold-soft">
              {item}
            </li>
          ))}
        </ul>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-night-soft/80 p-6">
          <h3 className="font-display text-2xl text-gold-soft">Gezegenler</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-2 font-medium">Gösterge</th>
                  <th className="pb-2 font-medium">Burç</th>
                  <th className="pb-2 font-medium">Derece</th>
                  <th className="pb-2 font-medium">Ev</th>
                </tr>
              </thead>
              <tbody>
                {chart.bodies.map((body) => (
                  <tr key={body.key} className="border-t border-white/5">
                    <td className="py-2">
                      {body.glyph} {body.label}
                      {body.retrograde ? " ℞" : ""}
                    </td>
                    <td>
                      {body.signGlyph} {body.signLabel}
                    </td>
                    <td>{body.formatted}</td>
                    <td>{body.house}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-night-soft/80 p-6">
          <h3 className="font-display text-2xl text-gold-soft">12 ev</h3>
          <ul className="mt-4 space-y-3">
            {chart.houses.map((house) => (
              <li key={house.id} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 text-sm">
                <div>
                  <p className="text-ink">
                    {house.label} · {house.signGlyph} {house.signLabel}
                  </p>
                  <p className="text-muted">{house.theme}</p>
                </div>
                <span className="text-muted">{house.formatted}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="rounded-3xl border border-line bg-night-soft/80 p-6">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gold">
          <CalendarRange className="h-4 w-4" aria-hidden="true" />
          Aşk ve kariyer tarihleri
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {chart.transits.map((item) => (
            <div key={`${item.month}-${item.title}`} className={`rounded-2xl border p-4 ${toneClass(item.tone)}`}>
              <p className="text-xs uppercase tracking-wide opacity-80">{item.month}</p>
              <p className="mt-1 font-medium">{item.title}</p>
              {unlocked.includes("timing") && item.items?.length ? (
                <ul className="mt-2 space-y-1.5 text-sm opacity-95">
                  {item.items.map((line) => (
                    <li key={line}>· {line}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm opacity-90">{`${item.detail.slice(0, 88)}…`}</p>
              )}
            </div>
          ))}
        </div>
      </article>

      <LockedReports
        reports={chart.reports}
        unlocked={unlocked}
        askLimit={askLimit}
        usedAsks={asks.length}
        chartId={chartId}
        birth={birth}
        checkoutId={checkoutId}
        onCheckoutId={setCheckoutId}
        onUnlocked={onUnlocked}
      />
      <AskPanel
        chartId={chartId}
        unlocked={unlocked.includes("ask")}
        askLimit={askLimit}
        asks={asks}
        onAsks={onAsks}
        onRequestPack={() => setCheckoutId("ask")}
      />
    </section>
  )
}
