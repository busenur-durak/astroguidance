import type {
  ElementBalance,
  FreeAnalysis,
  HouseCusp,
  LifeWindow,
  LockedReport,
  NatalChartResult,
  Placement,
  ReportSection,
  TransitWindow
} from "@/lib/types"
import { ELEMENT_COPY, ELEMENT_LABELS, SIGNS } from "@/lib/signs"
import { CAREER, LOVE } from "@/lib/profiles"
import { buildLifeWindows, buildTransits, syntheticMonthlySkies, syntheticYearlySkies } from "@/lib/timing"

export { buildLifeWindows, buildTransits } from "@/lib/timing"

const joinName = (name: string) => name.trim() || "Gezgin"

const flatten = (sections: ReportSection[]) =>
  sections
    .map((section) => {
      const bits = [section.title]
      if (section.text) bits.push(section.text)
      if (section.bullets?.length) bits.push(section.bullets.join(" · "))
      return bits.join(" — ")
    })
    .join("\n")

export const buildAnalysis = (params: {
  name: string
  sun: Placement
  moon: Placement
  rising: Placement
  elements: ElementBalance
}): FreeAnalysis => {
  const { name, sun, moon, rising, elements } = params
  const display = joinName(name)
  const sunSign = SIGNS[sun.sign]
  const moonSign = SIGNS[moon.sign]
  const risingSign = SIGNS[rising.sign]
  const dominantLabel = ELEMENT_LABELS[elements.dominant]

  const summary = `${display}, natal haritanın omurgası ${sunSign.label} Güneş, ${moonSign.label} Ay ve ${risingSign.label} Yükselen'den oluşur. ${sunSign.sun} ${moonSign.moon} Dışarıya yansıyan yüzün ise ${risingSign.rising}`

  return {
    title: `${sunSign.label} Güneş · ${moonSign.label} Ay · ${risingSign.label} Yükselen`,
    summary,
    strengths: [
      `${sunSign.label} Güneş: ${sunSign.keywords.join(", ")}`,
      `${moonSign.label} Ay: ${moonSign.keywords[0]}`,
      `${risingSign.label} Yükselen: ${risingSign.keywords[1] ?? risingSign.keywords[0]}`
    ],
    elementsText: `Baskın element ${dominantLabel} (Ateş ${elements.fire} · Toprak ${elements.earth} · Hava ${elements.air} · Su ${elements.water}). ${ELEMENT_COPY[elements.dominant]}`
  }
}

export const buildReports = (params: {
  name: string
  sun: Placement
  moon: Placement
  rising: Placement
  midheaven: Placement
  venus?: Placement
  mars?: Placement
  saturn?: Placement
  jupiter?: Placement
  houses: HouseCusp[]
}): LockedReport[] => {
  const house5 = params.houses[4]
  const house7 = params.houses[6]
  const house10 = params.houses[9]
  const house2 = params.houses[1]
  const venus = params.venus
  const mars = params.mars
  const saturn = params.saturn
  const jupiter = params.jupiter
  const love = LOVE[params.venus?.sign ?? params.sun.sign]
  const moonLove = LOVE[params.moon.sign]
  const seventh = LOVE[house7.sign]
  const career = CAREER[house10.sign]
  const sunCareer = CAREER[params.sun.sign]
  const risingCareer = CAREER[params.rising.sign]

  const loveSections: ReportSection[] = [
    {
      title: "İlişkide asıl ihtiyacın",
      text: `7. evin ${house7.signLabel} burcunda açılıyor; partner dilin buradan konuşur. ${seventh.need} ${moonLove.need}`
    },
    {
      title: "Sana iyi gelen duygular",
      bullets: [...new Set([...seventh.feelings, ...moonLove.feelings, ...love.feelings])].slice(0, 6)
    },
    {
      title: "Uyumlu burçlar",
      bullets: [
        `En güçlü çekim: ${house7.signLabel} (7. evin).`,
        `Venüs hattın: ${(venus ? LOVE[venus.sign].matches : love.matches).slice(0, 4).join(", ")}.`,
        `Ay'ın ısındığı tipler: ${moonLove.matches.slice(0, 3).join(", ")}.`,
        "Aynı elementle rahat eder, zıt elementle uyanırsın. Karışım iyidir; sürekli çatışma değil."
      ]
    },
    {
      title: "İlişkide güçlü yanların",
      bullets: [...love.gifts, ...seventh.gifts].slice(0, 6)
    },
    {
      title: "Partnerin sende neyi beslemeli",
      bullets: [
        `Sende ${seventh.feelings[0]} ve ${moonLove.feelings[0]} uyandırmalı; bunlar olmadan bağ soğur.`,
        seventh.need,
        `Uyumlu hat: ${seventh.matches.slice(0, 3).join(", ")}. Zıt burç çekebilir ama evde ${seventh.feelings[1]} şart.`
      ]
    },
    {
      title: "Dikkat etmen gerekenler",
      bullets: [...love.traps, ...moonLove.traps].slice(0, 5)
    },
    {
      title: "Partnerine nasıl davranmalısın",
      bullets: seventh.howToLove
    },
    {
      title: "Senin yapman gerekenler",
      bullets: [
        ...love.doThis,
        venus
          ? `Venüs ${venus.signLabel} ve ${venus.house}. evde: sevilme dilin burada görünür. Partnerin bu evi anlamadan Güneş'ini övmesi yetmez.`
          : "Venüs hattını günlük jestlerle besle.",
        mars
          ? `Mars ${mars.signLabel}'da. Arzu ve tartışmada ${SIGNS[mars.sign].keywords[0]} devreye girer. Öfkeyi saklama, ritme dök.`
          : "Çatışmayı erteleme."
      ]
    },
    {
      title: "5. ev — aşk ve keyif",
      text: `5. evin ${house5.signLabel}. Flört ve romantik jest burada ısınır. ${LOVE[house5.sign].feelings[0][0].toUpperCase()}${LOVE[house5.sign].feelings[0].slice(1)} hissi geldiğinde kalbin açılır.`
    }
  ]

  const careerSections: ReportSection[] = [
    {
      title: "Doğal yeteneklerin",
      bullets: [...new Set([...sunCareer.talents, ...career.talents, ...risingCareer.talents])].slice(0, 7)
    },
    {
      title: "Sana uygun meslekler",
      bullets: [...new Set([...career.jobs, ...sunCareer.jobs])].slice(0, 8)
    },
    {
      title: "İyi gelişeceğin ortamlar",
      bullets: career.rooms
    },
    {
      title: "Kariyer eğilimin",
      text: `10. evin ${house10.signLabel}, MC ${params.midheaven.signLabel}. ${career.outlook} ${params.rising.signLabel} yükselenin bu yolu ${risingCareer.rooms[0]} içinde daha kolay sunar.`
    },
    {
      title: "Ağırlık vermen gereken yönler",
      bullets: career.focus
    },
    {
      title: "Para ve statü",
      text: `2. evin ${house2.signLabel}. ${career.money} ${jupiter ? `Jüpiter ${SIGNS[jupiter.sign].label} ve ${jupiter.house}. evde genişleme kapısı oradadır.` : ""} ${saturn ? `Satürn ${SIGNS[saturn.sign].label} / ${saturn.house}. ev: tavan aceleyle değil, iskeletle yükselir.` : ""}`
    },
    {
      title: "Somut adımlar",
      bullets: career.steps
    }
  ]

  return [
    {
      id: "love",
      title: "İlişki & Aşk Raporu",
      price: "69 TL",
      priceNote: "Bağlanma dili, uyumlu burçlar, güçlü yanlar ve net yönlendirme",
      preview: loveSections[0].text?.slice(0, 200) + "…",
      body: flatten(loveSections),
      highlights: [`7. ev: ${house7.signLabel}`, venus ? `Venüs: ${venus.signLabel}` : "Venüs hattı", "Uyumlu burçlar ve eylem listesi"],
      sections: loveSections
    },
    {
      id: "career",
      title: "Kariyer, Para & Yaşam Amacı",
      price: "69 TL",
      priceNote: "Meslek önerileri, ortam, para dili ve somut adımlar",
      preview: careerSections[3].text?.slice(0, 200) + "…",
      body: flatten(careerSections),
      highlights: [`10. ev: ${house10.signLabel}`, `MC: ${params.midheaven.signLabel}`, "Meslek ve ortam listesi"],
      sections: careerSections
    },
    {
      id: "timing",
      title: "Tarih Pencereleri",
      price: "99 TL",
      priceNote: "Aşk–evlilik ve kariyer için en iyi ve en kötü tarihler",
      preview: "Aşk–evlilik ve kariyer için en iyi / en kötü tarihler; yakın 12 ay ve tüm hayat dönemleri.",
      body: "",
      highlights: ["Aşk ve evlilik en iyi / en kötü", "Kariyer en uygun / en riskli", "Tüm hayat dönemleri"],
      sections: []
    },
    {
      id: "ask",
      title: "Uzman Soru Hakkı",
      price: "39 TL",
      priceNote: "3 soru paketi · haklar birikir, tekrar alınır",
      preview:
        "İş değişimi, evlilik, ayrılık veya bir yıl sorusu gibi net bir soruyu haritandaki Güneş, Ay, 7. ve 10. evle yanıtlarız…",
      body: "Üç soruluk hak, natal verinin üzerine özel bir katman ekler. Yanıt doğrudan hüküm, harita gerekçesi ve yapılacaklar içerir.",
      highlights: ["3 soru / paket", "Tekrar alınabilir", "Doğrudan yanıt"],
      sections: [
        {
          title: "Nasıl sorulur",
          bullets: [
            "Tek bir karar sor: 'Bu yıl evlenmeli miyim?', 'İşi bırakayım mı?'",
            "Yıl veya kişi adı eklersen yanıt netleşir.",
            "Hak bitince 3 soruluk paketi tekrar al. Eski sorular silinmez."
          ]
        }
      ]
    }
  ]
}

export const refreshChartInterpretation = (chart: NatalChartResult): NatalChartResult => {
  const venus = chart.bodies.find((item) => item.key === "venus")
  const mars = chart.bodies.find((item) => item.key === "mars")
  const saturn = chart.bodies.find((item) => item.key === "saturn")
  const jupiter = chart.bodies.find((item) => item.key === "jupiter")
  const reports = buildReports({
    name: chart.name,
    sun: chart.sun,
    moon: chart.moon,
    rising: chart.rising,
    midheaven: chart.midheaven,
    venus,
    mars,
    saturn,
    jupiter,
    houses: chart.houses
  })
  const mercury = chart.bodies.find((item) => item.key === "mercury")
  const skies = syntheticMonthlySkies({ venus, mars, jupiter, saturn, sun: chart.sun, mercury })
  const birthYear = chart.origin?.date ? Number(chart.origin.date.slice(0, 4)) : undefined
  const yearSkies = syntheticYearlySkies({ jupiter, saturn, venus, sun: chart.sun, birthYear })
  const transits = buildTransits({
    skies,
    yearSkies,
    sun: chart.sun,
    moon: chart.moon,
    venus,
    mars,
    rising: chart.rising,
    midheaven: chart.midheaven
  })
  const lifeWindows = buildLifeWindows({
    house7: chart.houses[6],
    house10: chart.houses[9],
    house5: chart.houses[4],
    house2: chart.houses[1],
    venus,
    jupiter,
    saturn,
    sun: chart.sun,
    moon: chart.moon,
    rising: chart.rising,
    midheaven: chart.midheaven,
    skies: yearSkies
  })
  attachTimingContent({ reports, transits, lifeWindows })
  return { ...chart, reports, transits, lifeWindows }
}

export const attachTimingContent = (params: {
  reports: LockedReport[]
  transits: TransitWindow[]
  lifeWindows?: LifeWindow[]
}) => {
  const timing = params.reports.find((item) => item.id === "timing")
  if (!timing) return params.reports

  const monthSections: ReportSection[] = params.transits.map((item) => ({
    title: `${item.month} · ${item.title}`,
    bullets: item.items
  }))

  timing.sections = [
    {
      title: "Nasıl okunur",
      text: "Yakın 12 ay Venüs/Mars ile, hayat dönemleri Jüpiter ve Satürn'ün natal Venüs, DSC, Güneş ve MC transitleriyle okunur. 2030 sınırı yoktur; tavan ve dip yıllar tüm hayattan seçilir."
    },
    ...monthSections,
    ...(params.lifeWindows ?? []).map((window) => ({
      title: window.title,
      bullets: window.items
    }))
  ]
  timing.body = flatten(timing.sections)
  timing.preview = params.transits[0]?.items[0] ?? timing.preview

  return params.reports
}

export const describeResultMeta = (params: {
  name: string
  placeLabel: string
  date: string
  time: string
  timezone: string
}): Pick<NatalChartResult, "name" | "placeLabel" | "birthLabel" | "timezone"> => {
  const [year, month, day] = params.date.split("-")
  return {
    name: joinName(params.name),
    placeLabel: params.placeLabel,
    birthLabel: `${day}.${month}.${year} · ${params.time}`,
    timezone: params.timezone
  }
}
