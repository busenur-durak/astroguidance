import { SIGNS } from "@/lib/signs"
import { CAREER, LOVE } from "@/lib/profiles"
import type { NatalChartResult } from "@/lib/types"

const foldTr = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")

const MONTH_KEYS = [
  "ocak",
  "subat",
  "mart",
  "nisan",
  "mayis",
  "haziran",
  "temmuz",
  "agustos",
  "eylul",
  "ekim",
  "kasim",
  "aralik"
] as const

const MONTH_LABELS: Record<(typeof MONTH_KEYS)[number] | "current", string> = {
  ocak: "Ocak",
  subat: "Şubat",
  mart: "Mart",
  nisan: "Nisan",
  mayis: "Mayıs",
  haziran: "Haziran",
  temmuz: "Temmuz",
  agustos: "Ağustos",
  eylul: "Eylül",
  ekim: "Ekim",
  kasim: "Kasım",
  aralik: "Aralık",
  current: "Bu ay"
}

const hasStem = (text: string, word: string) => {
  const folded = foldTr(text)
  const needle = foldTr(word)
  if (needle === "is") {
    return /(?:^|[^a-z0-9])is(?:im|in|i|te|ten|e|ler|leri|siz|yeri)?(?:[^a-z0-9]|$)/.test(folded)
  }
  if (needle.length <= 2) {
    return new RegExp(`(?:^|[^a-z0-9])${needle}(?:[^a-z0-9]|$)`).test(folded)
  }
  return new RegExp(`(?:^|[^a-z0-9])${needle}`).test(folded)
}

const hasAny = (text: string, words: string[]) => words.some((word) => hasStem(text, word))

const yearIn = (question: string) => {
  const match = question.match(/\b(19\d{2}|20\d{2}|21[0-5]\d)\b/)
  return match ? match[0] : null
}

const monthIn = (question: string) => {
  const folded = foldTr(question)
  if (/(?:^|[^a-z])(bu ay|onumuzdeki ay)(?:[^a-z]|$)/.test(folded)) return "current"
  return (
    MONTH_KEYS.find((month) => new RegExp(`(?:^|[^a-z])${month}(?:de|da|te|ta|den|dan)?(?:[^a-z]|$)`).test(folded)) ??
    null
  )
}

const lane = (chart: NatalChartResult, topic: "Aşk" | "Kariyer", tone: "luck" | "caution") =>
  chart.transits.find((item) => item.month.includes(topic) && item.tone === tone)

const firstVerdict = (items: string[] | undefined, word: "EVET" | "HAYIR" | "BEKLE") =>
  items?.find((item) => item.includes(word))

const yearWindow = (chart: NatalChartResult, year: string) => {
  const numeric = Number(year)
  return chart.lifeWindows?.find((item) => {
    if (item.period.includes(year)) return true
    const range = item.period.match(/(\d{4})\D+(\d{4})/)
    if (!range) return false
    return numeric >= Number(range[1]) && numeric <= Number(range[2])
  })
}

const topicLine = (window: { items: string[] } | undefined, topic: "ask" | "kariyer") =>
  window?.items.find((item) =>
    topic === "ask" ? item.startsWith("Aşk") || item.includes("Aşk/evlilik") : item.startsWith("Kariyer")
  )

const itemsWith = (chart: NatalChartResult, needle: string) => {
  const folded = foldTr(needle)
  return chart.transits.flatMap((item) => item.items).filter((item) => foldTr(item).includes(folded))
}

export const answerAstroQuestion = (chart: NatalChartResult, question: string) => {
  const text = question.trim()
  if (text.length < 6) {
    throw new Error("Sorunu net yaz: evlenmeli miyim, işi bırakayım mı, 2041 nasıl geçer gibi.")
  }

  const folded = foldTr(text)
  const sun = SIGNS[chart.sun.sign]
  const moon = SIGNS[chart.moon.sign]
  const rising = SIGNS[chart.rising.sign]
  const house5 = chart.houses[4]
  const house7 = chart.houses[6]
  const house10 = chart.houses[9]
  const house2 = chart.houses[1]
  const house4 = chart.houses[3]
  const venus = chart.bodies.find((item) => item.key === "venus")
  const mars = chart.bodies.find((item) => item.key === "mars")
  const saturn = chart.bodies.find((item) => item.key === "saturn")
  const love = LOVE[house7.sign]
  const career = CAREER[house10.sign]
  const year = yearIn(text)
  const monthKey = monthIn(text)
  const loveBest = lane(chart, "Aşk", "luck")
  const loveWorst = lane(chart, "Aşk", "caution")
  const careerBest = lane(chart, "Kariyer", "luck")
  const careerWorst = lane(chart, "Kariyer", "caution")

  const close = (direct: string, why: string[], action: string[]) =>
    [
      `Sorun: ${text}`,
      "",
      `Doğrudan yanıt: ${direct}`,
      "",
      "Haritan neden böyle konuşuyor:",
      ...why.map((line) => `· ${line}`),
      "",
      "Ne yapmalısın:",
      ...action.map((line) => `· ${line}`)
    ].join("\n")

  const monthNeedle =
    monthKey === "current"
      ? foldTr(new Intl.DateTimeFormat("tr-TR", { month: "long" }).format(new Date()))
      : monthKey
  const monthHits = monthNeedle ? itemsWith(chart, monthNeedle) : []
  const yearHits = year ? itemsWith(chart, year) : []

  const aboutLove = hasAny(text, [
    "ask",
    "sevgi",
    "sevgili",
    "iliski",
    "flort",
    "uyum",
    "burc",
    "evlen",
    "partner",
    "kalp"
  ])
  const aboutWork = hasAny(text, [
    "is",
    "kariyer",
    "meslek",
    "para",
    "terfi",
    "istifa",
    "maas",
    "patron",
    "sirket",
    "girisim"
  ])

  if (hasAny(text, ["ayril", "bosan", "aldat", "terk et"]) || /iliskiyi bitir|bagi bitir|ayrilmali/.test(folded)) {
    const hardNow = firstVerdict(loveWorst?.items, "HAYIR")
    return close(
      hardNow
        ? `HAYIR — bu bağ şu an mühürlenmez. ${hardNow} 30 gün net konuş; aynı acı varsa çık.`
        : "Ayrılık tek başına natal haritadan evet/hayır çıkmaz. Önce 30 gün tek ihtiyaç cümlesi; hâlâ aynı acı varsa bırak.",
      [
        `7. evin ${house7.signLabel}: ${love.need}`,
        `Ay ${moon.label}: ${moon.keywords[0]} olmadan kalırsan hastalanırsın.`,
        mars ? `Mars ${mars.signLabel}: çatışma dilin sert. Bağırmadan cümle kur.` : "Öfkeyi erteleme.",
        hardNow ?? loveWorst?.items[0] ?? "Satürn 7. evde değilse acele boşanma eşiği yok."
      ],
      [
        "14 gün tek bir ihtiyaç cümlesi söyle, sonucu yaz.",
        "Küçük düşüren / gizleyen bağda kalma.",
        "Kararı gece değil, sabah netlikte ver."
      ]
    )
  }

  if (hasAny(text, ["evlen", "nikah"]) || /nisan(lan|las| yap| et)|aile kur|resmi bag/.test(folded)) {
    const peak = firstVerdict(loveBest?.items, "EVET")
    const yearLove = year ? topicLine(yearWindow(chart, year), "ask") : undefined
    const yearLine = yearLove ?? (year ? yearHits.find((item) => /evlilik|ask|bag/.test(foldTr(item))) : undefined)
    const monthLine = monthHits.find((item) => /ask|evlilik|nisan|bag|kalp|evet|hayir/.test(foldTr(item)))
    const direct = monthKey
      ? monthLine ?? `${MONTH_LABELS[monthKey]}: evlilik için eşik geçen transit yok. Nikâh yok.`
      : yearLine
        ? yearLine
        : peak
          ? peak
          : "HAYIR / henüz değil — evlilik için eşik geçen Jüpiter 7. ev / DSC transit'i yok."
    return close(direct, [
      `7. ev ${house7.signLabel}: partnerde ${love.feelings[0]} ve ${love.feelings[1]} ararsın.`,
      venus ? `Venüs ${venus.signLabel} / ${venus.house}. ev: resmiyet burada ısınır.` : "Venüs hattın jest ve güvenlik ister.",
      loveWorst?.items.find((item) => item.includes("HAYIR")) ?? loveWorst?.items[0] ?? `Tuzak: ${love.traps[0]}.`,
      `Uyumlu burçlar: ${love.matches.slice(0, 4).join(", ")}.`
    ], [
      ...(peak ? [peak] : []),
      ...love.doThis.slice(0, 2)
    ])
  }

  if (monthKey) {
    const loveLine = monthHits.find((item) => /ask|evlilik|kalp|flort|bag|evet|hayir/.test(foldTr(item)))
    const workLine = monthHits.find((item) => /kariyer|teklif|istifa|unvan|para|evet|hayir/.test(foldTr(item)))
    const monthLabel = MONTH_LABELS[monthKey]
    const nearestLove = firstVerdict(loveBest?.items, "EVET") ?? loveBest?.items[0]
    const nearestWork = firstVerdict(careerBest?.items, "EVET") ?? careerBest?.items[0]
    const direct = aboutLove
      ? (loveLine ?? `${monthLabel}: aşk/evlilik için eşik geçen transit yok. En yakın pencere: ${nearestLove ?? "yok."}`)
      : aboutWork
        ? (workLine ?? `${monthLabel}: kariyer sıçraması eşiği yok. En yakın pencere: ${nearestWork ?? "yok."}`)
        : monthHits[0] ?? `${monthLabel}: listede yok = büyük evet yok.`
    return close(direct, monthHits.slice(0, 4), [
      aboutWork ? nearestWork ?? career.steps[0] : nearestLove ?? love.doThis[0],
      "Bu pencereyi zorlama; listede yoksa o ay büyük evet yok."
    ])
  }

  if (year && yearHits.length && (aboutLove || aboutWork || !hasAny(text, ["evlen", "nikah"]))) {
    const loveLine = yearHits.find((item) => /ask|evlilik|bag|kalp/.test(foldTr(item)))
    const workLine = yearHits.find((item) => /kariyer|teklif|unvan|sirket|omurga|tavan/.test(foldTr(item)))
    const window = chart.lifeWindows?.find((item) => item.period.includes(year))
    const direct = aboutLove
      ? (loveLine ?? `${year} ilişki için: ${yearHits[0]}`)
      : aboutWork
        ? (workLine ?? `${year} kariyer için: ${yearHits[0]}`)
        : (yearHits[0] ?? window?.items[0] ?? `${year} için 7. ev ${house7.signLabel}, 10. ev ${house10.signLabel}.`)
    return close(direct, yearHits.slice(0, 5), [
      aboutWork ? career.steps[0] : love.doThis[0],
      `${year} yılını tek temaya indir: ya bağ ya iş.`
    ])
  }

  if (hasAny(text, ["cocuk", "hamile", "dogur", "bebek"])) {
    const open = firstVerdict(loveBest?.items, "EVET")
    return close(
      open
        ? `BEKLE / koşullu evet. 5. evin ${house5.signLabel}. ${open} Çocuk kararı sağlık ve tempo netken.`
        : `BEKLE. 5. evin ${house5.signLabel}. Kalp penceresi ısınmadan aile kararı yok.`,
      [
        `5. ev ${house5.signLabel}: çocuk ve yaratım kapısı.`,
        `Ay ${moon.label}: bakım dilin ${moon.keywords[0]}.`,
        open ?? loveBest?.items[0] ?? "Kalp işleri ısınmadan aile kararı yorar."
      ],
      ["Kararı sağlık ve tempo netken ver.", "Tek kişiye yüklenme."]
    )
  }

  if (hasAny(text, ["para", "borc", "zam", "fatura", "zengin", "birikim"])) {
    const moneyYes = careerBest?.items.find((item) => item.includes("EVET") && /para|zam|gelir/.test(foldTr(item)))
      ?? firstVerdict(careerBest?.items, "EVET")
    return close(
      moneyYes
        ? moneyYes
        : `BEKLE. 2. evin ${house2.signLabel}. ${career.money} Jüpiter 2. ev veya MC yumuşak açı olmadan spekülasyon yok.`,
      [
        moneyYes ?? careerBest?.items[0] ?? "Para kapısı eşik geçmeden ısınmaz.",
        saturn ? `Satürn ${saturn.signLabel} / ${saturn.house}. ev: kolay servet yok.` : "Düzenli gelir spekülasyondan güçlü.",
        `Meslek hattı: ${career.jobs.slice(0, 3).join(", ")}.`
      ],
      career.steps.slice(0, 3)
    )
  }

  if (hasAny(text, ["anne", "baba", "aile", "yuva", "tasin", "sehir", "yurt", "uzak"])) {
    const family = hasAny(text, ["anne", "baba", "aile", "yuva"])
    return close(
      family
        ? `Aile/yuva 4. evin ${house4.signLabel} üzerinden yürür. Kök koparmadan konuş; evet/hayır karşı tarafın haritası olmadan mühürlenmez.`
        : `BEKLE — tek yön bilet yok. 9. ev ${chart.houses[8].signLabel}. 3–6 ay deneme, 3 kriter: para, ritim, aidiyet.`,
      [
        `4. ev ${house4.signLabel}: yuva.`,
        `9. ev ${chart.houses[8].signLabel}: uzaklar.`,
        `Yükselen ${rising.label}: yeni yerde ilk izlenimin ${rising.keywords[0]}.`
      ],
      family
        ? ["Sınırı evde, bağırmadan koy.", "Geçmişi bugünün tek delili yapma."]
        : ["3 kriter yaz: para, ritim, aidiyet.", "3–6 ay deneme, tek yön bilet değil."]
    )
  }

  if (
    /(?:le|la) olur|ile olur|ile uyum|uyumlu muyuz/.test(folded) ||
    hasAny(text, ["ask", "sevgi", "sevgili", "iliski", "flort", "uyum", "burc", "partner"])
  ) {
    const wantsSign = hasAny(text, ["burc", "hangi"])
    const named = /(?:le|la) olur|ile olur|ile uyum|uyumlu muyuz/.test(folded)
    const peak = firstVerdict(loveBest?.items, "EVET")
    const direct = wantsSign
      ? `Sana ${love.matches[0]}, ${love.matches[1]} ve ${love.matches[2]} hattı iyi gelir. ${love.need}`
      : named
        ? `Kesin evet yok — karşı tarafın doğum tarihi/saati olmadan isimden hüküm üretilemez. Senin 7. evin ${house7.signLabel}: ${love.need}`
      : peak
        ? peak
        : `${love.need} En yakın pencere: ${loveBest?.items[0] ?? "eşik geçen transit yok."}`
    return close(direct, [
      `7. ev ${house7.signLabel}, 5. ev ${house5.signLabel}.`,
      `Güçlü yanların: ${love.gifts.slice(0, 3).join(", ")}.`,
      `Tuzak: ${love.traps[0]}.`,
      loveWorst?.items.find((item) => item.includes("HAYIR")) ?? loveWorst?.items[0] ?? `Ay ${moon.label}: ${moon.moon}`
    ], [...love.howToLove.slice(0, 2), love.doThis[0]])
  }

  if (
    hasAny(text, ["is", "kariyer", "meslek", "terfi", "istifa", "patron", "sirket", "girisim", "maas"]) ||
    /kendi is|is degis|yeni is|birakayim/.test(folded)
  ) {
    const own = /kendi is|girisim/.test(folded)
    const leave = hasAny(text, ["istifa", "birak"]) || /birakayim/.test(folded)
    const workYes = firstVerdict(careerBest?.items, "EVET")
    const workNo = firstVerdict(careerWorst?.items, "HAYIR")
    const yearWork = year ? topicLine(yearWindow(chart, year), "kariyer") : undefined
    const direct = own
      ? workYes
        ? `KOŞULLU EVET. ${workYes} ${career.steps[0]}`
        : `BEKLE. Kendi iş için Jüpiter 10./2. ev eşiği yok. ${career.steps[0]}`
      : leave
        ? workNo
          ? `HAYIR. ${workNo}`
          : "HAYIR — acele istifa tavanı düşürür. Yeni teklif masada değilse çıkma."
        : yearWork
          ? yearWork
          : workYes
            ? workYes
            : `BEKLE. 10. evin ${house10.signLabel}. Sıçrama eşiği yok.`
    return close(direct, [
      `10. ev ${house10.signLabel}, MC ${chart.midheaven.signLabel}.`,
      `Uygun meslekler: ${career.jobs.slice(0, 4).join(", ")}.`,
      `İyi ortam: ${career.rooms[0]}.`,
      workNo ?? careerWorst?.items[0] ?? (saturn ? `Satürn ${saturn.signLabel}: acele yok.` : "Sorumluluk aldığın iş kalır.")
    ], career.steps)
  }

  if (hasAny(text, ["saglik", "enerji", "tuken", "stres", "depres", "uyku"])) {
    return close(
      "Önce ritim. Bu soruda haritan büyük evet değil, sinir ve sınır konuşuyor.",
      [
        `6. ev ${chart.houses[5].signLabel}: günlük iş ve beden.`,
        `Ay ${moon.label}: ${moon.keywords.join(", ")} bozulunca sağlık bozulur.`,
        `Baskın element ${chart.elements.dominant}.`
      ],
      ["21 gün uyku ve tek beden ritüeli.", "Hasta hâlde ilişki veya iş kararı yok."]
    )
  }

  if (year) {
    const window = yearWindow(chart, year)
    const loveLine = topicLine(window, "ask") ?? yearHits.find((item) => /ask|evlilik|bag|kalp/.test(foldTr(item)))
    const workLine = topicLine(window, "kariyer") ?? yearHits.find((item) => /kariyer|teklif|unvan|sirket/.test(foldTr(item)))
    const direct = aboutLove
      ? (loveLine ?? `${year} ilişki yılı: eşik geçen evlilik transit'i yok. 7. ev ${house7.signLabel}.`)
      : aboutWork
        ? (workLine ?? `${year} kariyer yılı: sıçrama eşiği yok. 10. ev ${house10.signLabel}.`)
        : (loveLine && workLine
          ? `${loveLine} ${workLine}`
          : yearHits[0] ?? window?.items[0] ?? `${year} için 7. ev ${house7.signLabel}, 10. ev ${house10.signLabel}.`)
    return close(direct, yearHits.slice(0, 4).concat(window?.items ?? []).slice(0, 5), [
      aboutWork ? career.steps[0] : love.doThis[0],
      `${year} yılını tek temaya indir: ya bağ ya iş.`
    ])
  }

  return close(
    "Kesin evet/hayır yok — soruyu yıl, ay veya tek karara indir: evlen / bırak / başvur.",
    [
      `Güneş: ${sun.sun}`,
      `Ay: ${moon.moon}`,
      `7. ev ${house7.signLabel} ilişki, 10. ev ${house10.signLabel} kariyer.`,
      firstVerdict(loveBest?.items, "EVET") ?? loveBest?.items[0] ?? chart.analysis.strengths[0],
      firstVerdict(careerBest?.items, "EVET") ?? careerBest?.items[0] ?? career.outlook
    ],
    [
      "Soruyu tek karara indir: evlen / bırak / bekle / başvur.",
      aboutLove ? love.doThis[0] : career.steps[0],
      "Yıl veya ay yazarsan transit hükmü döner."
    ]
  )
}
