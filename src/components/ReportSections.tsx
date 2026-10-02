import type { ReportSection } from "@/lib/types"

type ReportSectionsProps = {
  sections: ReportSection[]
}

export const ReportSections = ({ sections }: ReportSectionsProps) => {
  if (!sections.length) return null

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.title}>
          <h4 className="font-display text-xl text-gold-soft">{section.title}</h4>
          {section.text && <p className="mt-2 leading-7 text-ink/90">{section.text}</p>}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-2 space-y-2">
              {section.bullets.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-ink/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
