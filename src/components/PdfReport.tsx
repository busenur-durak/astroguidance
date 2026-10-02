import { ELEMENT_LABELS } from "@/lib/signs"
import type { AskTurn, NatalChartResult } from "@/lib/types"

type PdfReportProps = {
  chart: NatalChartResult
  unlocked: string[]
  asks: AskTurn[]
}

export const PdfReport = ({ chart, unlocked, asks }: PdfReportProps) => {
  const openReports = chart.reports.filter((report) => unlocked.includes(report.id))

  return (
    <div
      id="pdf-report"
      className="pointer-events-none absolute top-0 left-[-1400px] w-[794px] bg-white p-12 text-[#1b1724]"
      aria-hidden="true"
    >
      <p className="text-xs tracking-[0.25em] text-amber-700 uppercase">AstroGuidance</p>
      <h1 className="mt-2 text-4xl font-serif">{chart.name}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {chart.birthLabel} · {chart.placeLabel} · {chart.timezone}
      </p>
      <h2 className="mt-8 text-2xl font-serif">{chart.analysis.title}</h2>
      <p className="mt-3 leading-7">{chart.analysis.summary}</p>
      <p className="mt-3 leading-7 text-neutral-700">{chart.analysis.elementsText}</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[chart.sun, chart.moon, chart.rising].map((item) => (
          <div key={item.key} className="rounded-xl border border-neutral-200 p-3">
            <p className="text-xs uppercase text-neutral-500">{item.label}</p>
            <p className="text-xl">
              {item.signGlyph} {item.signLabel}
            </p>
            <p className="text-sm">
              {item.formatted} · {item.house}. ev
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm">Baskın element: {ELEMENT_LABELS[chart.elements.dominant]}</p>
      <h3 className="mt-8 text-xl font-serif">Gezegenler</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {chart.bodies.map((body) => (
          <li key={body.key}>
            {body.label}: {body.signLabel} {body.formatted} · {body.house}. ev
            {body.retrograde ? " ℞" : ""}
          </li>
        ))}
      </ul>
      <h3 className="mt-8 text-xl font-serif">12 ev</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {chart.houses.map((house) => (
          <li key={house.id}>
            {house.label} · {house.signLabel} — {house.theme}
          </li>
        ))}
      </ul>
      {unlocked.includes("timing") && (
        <>
          <h3 className="mt-8 text-xl font-serif">Aşk ve kariyer tarihleri</h3>
          {chart.transits.map((item) => (
            <div key={`${item.month}-${item.title}`} className="mt-3">
              <p className="font-medium">
                {item.month} · {item.title}
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {(item.items?.length ? item.items : [item.detail]).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
      {openReports.map((report) => (
        <section key={report.id} className="mt-8">
          <h3 className="text-xl font-serif">{report.title}</h3>
          {report.sections?.length ? (
            report.sections.map((section) => (
              <div key={section.title} className="mt-3">
                <p className="font-medium">{section.title}</p>
                {section.text && <p className="mt-1 leading-7">{section.text}</p>}
                {section.bullets && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {section.bullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="mt-2 leading-7">{report.body}</p>
          )}
        </section>
      ))}
      {asks.map((item) => (
        <section key={item.question} className="mt-6">
          <p className="font-medium">Soru: {item.question}</p>
          <p className="mt-1 leading-7">{item.answer}</p>
        </section>
      ))}
    </div>
  )
}
