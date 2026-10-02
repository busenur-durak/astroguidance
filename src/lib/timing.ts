import { CAREER, LOVE } from "@/lib/profiles"
import { SIGN_ORDER, SIGNS } from "@/lib/signs"
import type {
  HouseCusp,
  LifeWindow,
  MonthlySky,
  Placement,
  SignKey,
  SkyBody,
  TransitTone,
  TransitWindow,
  YearlySky
} from "@/lib/types"

const monthFormatter = new Intl.DateTimeFormat("tr-TR", {
  month: "long",
  year: "numeric"
})

const houseOf = (value: number) => ((value - 1 + 12) % 12) + 1

const wrap360 = (value: number) => {
  const result = value % 360
  return result < 0 ? result + 360 : result
}

const angleDelta = (left: number, right: number) => {
  const delta = Math.abs(left - right) % 360
  return delta > 180 ? 360 - delta : delta
}

type AspectName = "kavuşum" | "üçgen" | "sekstil" | "kare" | "karşıt"

const aspectOf = (transit: number, natal: number, orb: number) => {
  const distance = angleDelta(transit, natal)
  const table: Array<[AspectName, number, number]> = [
    ["kavuşum", 0, orb],
    ["sekstil", 60, Math.max(2, orb - 2)],
    ["kare", 90, orb],
    ["üçgen", 120, orb],
    ["karşıt", 180, orb]
  ]
  for (const [name, exact, allow] of table) {
    const gap = Math.abs(distance - exact)
    if (gap <= allow) return { name, gap }
  }
  return null
}

const bodyOf = (body: Placement | undefined, fallbackHouse: number, fallbackSign: SignKey, fallbackDegree = 0): SkyBody => ({
  house: body?.house ?? fallbackHouse,
  sign: body?.sign ?? fallbackSign,
  ecliptic: body?.ecliptic ?? fallbackDegree
})

export const syntheticMonthlySkies = (params: {
  venus?: Placement
  mars?: Placement
  jupiter?: Placement
  saturn?: Placement
  sun: Placement
  mercury?: Placement
}): MonthlySky[] => {
  const start = new Date()
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 12)
    const venus = bodyOf(params.venus, 7, params.sun.sign)
    const mars = bodyOf(params.mars, 1, params.sun.sign)
    const mercury = bodyOf(params.mercury, 3, params.sun.sign)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      venus: {
        house: houseOf(venus.house + index),
        sign: SIGN_ORDER[(SIGN_ORDER.indexOf(venus.sign) + index) % 12],
        ecliptic: wrap360(venus.ecliptic + index * 30)
      },
      mars: {
        house: houseOf(mars.house + Math.floor(index / 2)),
        sign: SIGN_ORDER[(SIGN_ORDER.indexOf(mars.sign) + Math.floor(index / 2)) % 12],
        ecliptic: wrap360(mars.ecliptic + Math.floor(index / 2) * 30)
      },
      jupiter: bodyOf(params.jupiter, 9, params.sun.sign),
      saturn: bodyOf(params.saturn, 10, params.sun.sign),
      sun: {
        house: houseOf(params.sun.house + index),
        sign: SIGN_ORDER[(SIGN_ORDER.indexOf(params.sun.sign) + index) % 12],
        ecliptic: wrap360(params.sun.ecliptic + index * 30)
      },
      mercury: {
        house: houseOf(mercury.house + index),
        sign: SIGN_ORDER[(SIGN_ORDER.indexOf(mercury.sign) + index) % 12],
        ecliptic: wrap360(mercury.ecliptic + index * 30)
      }
    }
  })
}

const JUPITER_YEAR = 30.348
const SATURN_YEAR = 12.221

const signFromEcliptic = (ecliptic: number) => SIGN_ORDER[Math.floor(wrap360(ecliptic) / 30) % 12]

export const syntheticYearlySkies = (params: {
  jupiter?: Placement
  saturn?: Placement
  venus?: Placement
  sun: Placement
  birthYear?: number
}): YearlySky[] => {
  const now = new Date().getFullYear()
  const birthYear = params.birthYear ?? now - 30
  const start = birthYear + 14
  const end = Math.max(birthYear + 88, now + 45)
  const jupiter = bodyOf(params.jupiter, 9, params.sun.sign)
  const saturn = bodyOf(params.saturn, 10, params.sun.sign)
  const venus = bodyOf(params.venus, 7, params.sun.sign)
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const year = start + index
    const drift = year - now
    const jup: SkyBody = {
      ecliptic: wrap360(jupiter.ecliptic + drift * JUPITER_YEAR),
      house: houseOf(jupiter.house + Math.round((drift * JUPITER_YEAR) / 30)),
      sign: signFromEcliptic(jupiter.ecliptic + drift * JUPITER_YEAR)
    }
    const sat: SkyBody = {
      ecliptic: wrap360(saturn.ecliptic + drift * SATURN_YEAR),
      house: houseOf(saturn.house + Math.round((drift * SATURN_YEAR) / 30)),
      sign: signFromEcliptic(saturn.ecliptic + drift * SATURN_YEAR)
    }
    return {
      year,
      jupiter: jup,
      saturn: sat,
      venus,
      samples: [{ month: 6, jupiter: jup, saturn: sat, venus }]
    }
  })
}

type NatalPoints = {
  sun: Placement
  moon: Placement
  venus?: Placement
  mars?: Placement
  rising?: Placement
  midheaven?: Placement
}

type Hit = {
  score: number
  reasons: string[]
}

const addAspect = (
  hit: Hit,
  transit: SkyBody,
  transitName: string,
  natal: Placement | undefined,
  natalName: string,
  orb: number,
  weight: { soft: number; hard: number }
) => {
  if (!natal) return
  const aspect = aspectOf(transit.ecliptic, natal.ecliptic, orb)
  if (!aspect) return
  const hard =
    aspect.name === "kare" ||
    aspect.name === "karşıt" ||
    (transitName === "Satürn" && aspect.name === "kavuşum")
  hit.score += hard ? weight.hard : weight.soft
  hit.reasons.push(`${transitName} natal ${natalName}'e ${aspect.name} (${aspect.gap.toFixed(1)}°)`)
}

const dscOf = (natal: NatalPoints) => {
  if (!natal.rising) return undefined
  return { ...natal.rising, ecliptic: wrap360(natal.rising.ecliptic + 180) }
}

const loveHit = (sky: MonthlySky, natal: NatalPoints): Hit => {
  const hit: Hit = { score: 0, reasons: [] }
  const dsc = dscOf(natal)

  if (sky.jupiter.house === 7) {
    hit.score += 4
    hit.reasons.push(`Jüpiter natal 7. evde (${SIGNS[sky.jupiter.sign].label})`)
  }
  if (sky.jupiter.house === 5) {
    hit.score += 3
    hit.reasons.push("Jüpiter natal 5. evde")
  }
  if (sky.jupiter.house === 11) {
    hit.score += 2
    hit.reasons.push("Jüpiter natal 11. evde")
  }
  if (sky.venus.house === 7 || sky.venus.house === 5) {
    hit.score += 3
    hit.reasons.push(`Venüs natal ${sky.venus.house}. evde`)
  }
  if (sky.saturn.house === 7) {
    hit.score -= 4
    hit.reasons.push("Satürn natal 7. evde")
  }
  if (sky.saturn.house === 5 || sky.saturn.house === 8) {
    hit.score -= 2
    hit.reasons.push(`Satürn natal ${sky.saturn.house}. evde`)
  }
  if (sky.venus.house === 12 || sky.venus.house === 8) {
    hit.score -= 3
    hit.reasons.push(`Venüs natal ${sky.venus.house}. evde`)
  }
  if (sky.mars.house === 7 || sky.mars.house === 8) {
    hit.score -= 2
    hit.reasons.push(`Mars natal ${sky.mars.house}. evde`)
  }

  addAspect(hit, sky.jupiter, "Jüpiter", natal.venus, "Venüs", 6, { soft: 3, hard: -2 })
  addAspect(hit, sky.jupiter, "Jüpiter", natal.moon, "Ay", 6, { soft: 2, hard: -1 })
  addAspect(hit, sky.jupiter, "Jüpiter", dsc, "DSC", 6, { soft: 3, hard: -2 })
  addAspect(hit, sky.saturn, "Satürn", natal.venus, "Venüs", 6, { soft: -1, hard: -4 })
  addAspect(hit, sky.saturn, "Satürn", dsc, "DSC", 6, { soft: -1, hard: -3 })
  addAspect(hit, sky.venus, "Venüs", natal.venus, "Venüs", 5, { soft: 2, hard: -1 })
  addAspect(hit, sky.mars, "Mars", natal.venus, "Venüs", 5, { soft: 1, hard: -3 })
  if (hit.reasons.some((item) => item.startsWith("Satürn") && (item.includes("Venüs") || item.includes("DSC")) && (item.includes("kavuşum") || item.includes("kare") || item.includes("karşıt")))) {
    hit.score = Math.min(hit.score, 2)
  }
  return hit
}

const careerHit = (sky: MonthlySky, natal: NatalPoints): Hit => {
  const hit: Hit = { score: 0, reasons: [] }

  if (sky.jupiter.house === 10) {
    hit.score += 4
    hit.reasons.push(`Jüpiter natal 10. evde (${SIGNS[sky.jupiter.sign].label})`)
  }
  if (sky.jupiter.house === 2 || sky.jupiter.house === 6) {
    hit.score += 3
    hit.reasons.push(`Jüpiter natal ${sky.jupiter.house}. evde`)
  }
  if (sky.jupiter.house === 11) {
    hit.score += 2
    hit.reasons.push("Jüpiter natal 11. evde")
  }
  if (sky.sun.house === 10) {
    hit.score += 2
    hit.reasons.push("Güneş natal 10. evde")
  }
  if (sky.saturn.house === 10) {
    hit.score -= 3
    hit.reasons.push("Satürn natal 10. evde")
  }
  if (sky.saturn.house === 6 || sky.saturn.house === 12) {
    hit.score -= 2
    hit.reasons.push(`Satürn natal ${sky.saturn.house}. evde`)
  }
  if (sky.mars.house === 8 || sky.mars.house === 12) {
    hit.score -= 2
    hit.reasons.push(`Mars natal ${sky.mars.house}. evde`)
  }
  if (sky.sun.house === 12 || sky.sun.house === 8) {
    hit.score -= 2
    hit.reasons.push(`Güneş natal ${sky.sun.house}. evde`)
  }

  addAspect(hit, sky.jupiter, "Jüpiter", natal.sun, "Güneş", 6, { soft: 3, hard: -1 })
  addAspect(hit, sky.jupiter, "Jüpiter", natal.midheaven, "MC", 6, { soft: 4, hard: -2 })
  addAspect(hit, sky.saturn, "Satürn", natal.sun, "Güneş", 6, { soft: -1, hard: -4 })
  addAspect(hit, sky.saturn, "Satürn", natal.midheaven, "MC", 6, { soft: -1, hard: -4 })
  addAspect(hit, sky.mars, "Mars", natal.midheaven, "MC", 5, { soft: 1, hard: -3 })
  if (hit.reasons.some((item) => item.startsWith("Satürn") && (item.includes("Güneş") || item.includes("MC")) && (item.includes("kavuşum") || item.includes("kare") || item.includes("karşıt")))) {
    hit.score = Math.min(hit.score, 2)
  }
  return hit
}

const slowLoveHit = (jupiter: SkyBody, saturn: SkyBody, natal: NatalPoints): Hit => {
  const hit: Hit = { score: 0, reasons: [] }
  const dsc = dscOf(natal)
  if (jupiter.house === 7) {
    hit.score += 4
    hit.reasons.push(`Jüpiter natal 7. evde (${SIGNS[jupiter.sign].label})`)
  }
  if (jupiter.house === 5) {
    hit.score += 3
    hit.reasons.push("Jüpiter natal 5. evde")
  }
  if (jupiter.house === 11) {
    hit.score += 2
    hit.reasons.push("Jüpiter natal 11. evde")
  }
  if (saturn.house === 7) {
    hit.score -= 4
    hit.reasons.push("Satürn natal 7. evde")
  }
  if (saturn.house === 5 || saturn.house === 8) {
    hit.score -= 2
    hit.reasons.push(`Satürn natal ${saturn.house}. evde`)
  }
  addAspect(hit, jupiter, "Jüpiter", natal.venus, "Venüs", 6, { soft: 3, hard: -2 })
  addAspect(hit, jupiter, "Jüpiter", natal.moon, "Ay", 6, { soft: 2, hard: -1 })
  addAspect(hit, jupiter, "Jüpiter", dsc, "DSC", 6, { soft: 3, hard: -2 })
  addAspect(hit, saturn, "Satürn", natal.venus, "Venüs", 6, { soft: -1, hard: -4 })
  addAspect(hit, saturn, "Satürn", dsc, "DSC", 6, { soft: -1, hard: -3 })
  if (hit.reasons.some((item) => item.startsWith("Satürn") && (item.includes("Venüs") || item.includes("DSC")) && (item.includes("kavuşum") || item.includes("kare") || item.includes("karşıt")))) {
    hit.score = Math.min(hit.score, 2)
  }
  return hit
}

const slowCareerHit = (jupiter: SkyBody, saturn: SkyBody, natal: NatalPoints): Hit => {
  const hit: Hit = { score: 0, reasons: [] }
  if (jupiter.house === 10) {
    hit.score += 4
    hit.reasons.push(`Jüpiter natal 10. evde (${SIGNS[jupiter.sign].label})`)
  }
  if (jupiter.house === 2 || jupiter.house === 6) {
    hit.score += 3
    hit.reasons.push(`Jüpiter natal ${jupiter.house}. evde`)
  }
  if (jupiter.house === 11) {
    hit.score += 2
    hit.reasons.push("Jüpiter natal 11. evde")
  }
  if (saturn.house === 10) {
    hit.score -= 3
    hit.reasons.push("Satürn natal 10. evde")
  }
  if (saturn.house === 6 || saturn.house === 12) {
    hit.score -= 2
    hit.reasons.push(`Satürn natal ${saturn.house}. evde`)
  }
  addAspect(hit, jupiter, "Jüpiter", natal.sun, "Güneş", 6, { soft: 3, hard: -1 })
  addAspect(hit, jupiter, "Jüpiter", natal.midheaven, "MC", 6, { soft: 4, hard: -2 })
  addAspect(hit, saturn, "Satürn", natal.sun, "Güneş", 6, { soft: -1, hard: -4 })
  addAspect(hit, saturn, "Satürn", natal.midheaven, "MC", 6, { soft: -1, hard: -4 })
  if (hit.reasons.some((item) => item.startsWith("Satürn") && (item.includes("Güneş") || item.includes("MC")) && (item.includes("kavuşum") || item.includes("kare") || item.includes("karşıt")))) {
    hit.score = Math.min(hit.score, 2)
  }
  return hit
}

const yearLoveHit = (sky: YearlySky, natal: NatalPoints) => {
  const pack = sky.samples?.length ? sky.samples : [{ month: 6, jupiter: sky.jupiter, saturn: sky.saturn, venus: sky.venus }]
  return pack
    .map((sample) => slowLoveHit(sample.jupiter, sample.saturn, natal))
    .sort((a, b) => b.score - a.score)[0]
}

const yearCareerHit = (sky: YearlySky, natal: NatalPoints) => {
  const pack = sky.samples?.length ? sky.samples : [{ month: 6, jupiter: sky.jupiter, saturn: sky.saturn, venus: sky.venus }]
  return pack
    .map((sample) => slowCareerHit(sample.jupiter, sample.saturn, natal))
    .sort((a, b) => b.score - a.score)[0]
}

const yearCareerHard = (sky: YearlySky, natal: NatalPoints) => {
  const pack = sky.samples?.length ? sky.samples : [{ month: 6, jupiter: sky.jupiter, saturn: sky.saturn, venus: sky.venus }]
  return pack
    .map((sample) => slowCareerHit(sample.jupiter, sample.saturn, natal))
    .sort((a, b) => a.score - b.score)[0]
}

const yearLoveHard = (sky: YearlySky, natal: NatalPoints) => {
  const pack = sky.samples?.length ? sky.samples : [{ month: 6, jupiter: sky.jupiter, saturn: sky.saturn, venus: sky.venus }]
  return pack
    .map((sample) => slowLoveHit(sample.jupiter, sample.saturn, natal))
    .sort((a, b) => a.score - b.score)[0]
}

type ScoredMonth = {
  sky: MonthlySky
  label: string
  stamp: number
  love: Hit
  career: Hit
}

const monthLabel = (sky: MonthlySky) => monthFormatter.format(new Date(sky.year, sky.month - 1, 1))

const formatRange = (group: ScoredMonth[]) => {
  if (group.length === 1) return group[0].label
  const first = group[0]
  const last = group[group.length - 1]
  const firstName = first.label.replace(/\s\d{4}$/, "")
  if (first.sky.year === last.sky.year) return `${firstName}–${last.label}`
  return `${first.label} – ${last.label}`
}

const cluster = (months: ScoredMonth[]) => {
  if (!months.length) return [] as ScoredMonth[][]
  const sorted = [...months].sort((a, b) => a.stamp - b.stamp)
  const groups: ScoredMonth[][] = [[sorted[0]]]
  sorted.slice(1).forEach((item) => {
    const last = groups[groups.length - 1]
    const prev = last[last.length - 1]
    if (item.stamp === prev.stamp + 1) last.push(item)
    else groups.push([item])
  })
  return groups
}

const takeQualified = (scored: ScoredMonth[], key: "love" | "career", high: boolean) => {
  const threshold = high ? 3 : -3
  const qualified = scored.filter((item) => (high ? item[key].score >= threshold : item[key].score <= threshold))
  return cluster(qualified)
    .sort((left, right) => {
      const leftScore = high
        ? Math.max(...left.map((item) => item[key].score))
        : Math.min(...left.map((item) => item[key].score))
      const rightScore = high
        ? Math.max(...right.map((item) => item[key].score))
        : Math.min(...right.map((item) => item[key].score))
      return high ? rightScore - leftScore : leftScore - rightScore
    })
    .slice(0, 3)
    .sort((left, right) => left[0].stamp - right[0].stamp)
}

const peakOf = (group: ScoredMonth[], key: "love" | "career", high: boolean) =>
  [...group].sort((a, b) => (high ? b[key].score - a[key].score : a[key].score - b[key].score))[0]

const cite = (hit: Hit) => {
  const ranked = [...hit.reasons].sort((left, right) => {
    const weight = (line: string) => {
      if (line.includes("7. ev") || line.includes("DSC") || line.includes("MC") || line.includes("10. ev")) return 0
      if (line.includes("Venüs") || line.includes("Güneş")) return 1
      return 2
    }
    return weight(left) - weight(right)
  })
  return ranked[0] ? ` (${ranked.slice(0, 2).join("; ")})` : ""
}

const isMarriageHit = (hit: Hit) =>
  hit.reasons.some((item) => {
    const soft = !item.includes("kare") && !item.includes("karşıt")
    const jupiterSeventh = item.includes("Jüpiter natal 7. ev")
    const venusSeventh = item.includes("Venüs natal 7")
    const jupiterDsc = item.includes("Jüpiter") && item.includes("DSC") && soft
    return jupiterSeventh || venusSeventh || jupiterDsc
  })

const loveBestLine = (range: string, row: ScoredMonth) => {
  if (isMarriageHit(row.love)) {
    return `${range}: EVET — evlilik / resmi bağ için en temiz pencere.${cite(row.love)}`
  }
  if (row.sky.venus.house === 5 || row.sky.jupiter.house === 5) {
    return `${range}: EVET — yeni bağ ve flört açılır.${cite(row.love)}`
  }
  return `${range}: EVET — ilişki ısınır, nikâh eşiği değil.${cite(row.love)}`
}

const loveWorstLine = (range: string, row: ScoredMonth) => {
  if (row.sky.saturn.house === 7 || row.love.reasons.some((item) => item.includes("Satürn"))) {
    return `${range}: HAYIR — nikâh yok. Satürn ilişkiyi sınar.${cite(row.love)}`
  }
  if (row.sky.venus.house === 12 || row.sky.venus.house === 8) {
    return `${range}: HAYIR — gizli bağ / üçgen. Kalbi emanet etme.${cite(row.love)}`
  }
  return `${range}: HAYIR — evlilik ve yeni emanet yok.${cite(row.love)}`
}

const careerBestLine = (range: string, row: ScoredMonth) => {
  if (row.sky.jupiter.house === 10 || row.career.reasons.some((item) => item.includes("MC"))) {
    return `${range}: EVET — kariyer sıçraması. Teklif ve unvan açık.${cite(row.career)}`
  }
  if (row.sky.jupiter.house === 2) {
    return `${range}: EVET — para ve zam penceresi.${cite(row.career)}`
  }
  return `${range}: EVET — iş görünür, başvur ve imza zamanı.${cite(row.career)}`
}

const careerWorstLine = (range: string, row: ScoredMonth) => {
  if (row.sky.saturn.house === 10 || row.career.reasons.some((item) => item.includes("Satürn"))) {
    return `${range}: HAYIR — istifa/imza yok. Satürn tavanı sınar.${cite(row.career)}`
  }
  return `${range}: HAYIR — sözleşme ve borç yok.${cite(row.career)}`
}

const emit = (
  groups: ScoredMonth[][],
  key: "love" | "career",
  high: boolean,
  line: (range: string, row: ScoredMonth) => string,
  empty: string
) => {
  if (!groups.length) return [empty]
  return groups.map((group) => line(formatRange(group), peakOf(group, key, high)))
}

export const buildTransits = (params: {
  skies: MonthlySky[]
  yearSkies?: YearlySky[]
  sun: Placement
  moon: Placement
  venus?: Placement
  mars?: Placement
  rising?: Placement
  midheaven?: Placement
}): TransitWindow[] => {
  const natal: NatalPoints = {
    sun: params.sun,
    moon: params.moon,
    venus: params.venus,
    mars: params.mars,
    rising: params.rising,
    midheaven: params.midheaven
  }

  const scored: ScoredMonth[] = params.skies.map((sky) => ({
    sky,
    label: monthLabel(sky),
    stamp: sky.year * 12 + sky.month,
    love: loveHit(sky, natal),
    career: careerHit(sky, natal)
  }))

  const loveBest = emit(
    takeQualified(scored, "love", true),
    "love",
    true,
    loveBestLine,
    "Önümüzdeki 12 ay zayıf. Hayat tavanı aşağıdaki yıllarda."
  )
  const loveWorst = emit(
    takeQualified(scored, "love", false),
    "love",
    false,
    loveWorstLine,
    "Önümüzdeki 12 ayda kırmızı alarm yok. Uzun dip dönemler aşağıdaki yıllarda."
  )
  const careerBest = emit(
    takeQualified(scored, "career", true),
    "career",
    true,
    careerBestLine,
    "Önümüzdeki 12 ay zayıf. Kariyer tavanı aşağıdaki yıllarda."
  )
  const careerWorst = emit(
    takeQualified(scored, "career", false),
    "career",
    false,
    careerWorstLine,
    "Önümüzdeki 12 ayda kırmızı alarm yok. Uzun dip dönemler aşağıdaki yıllarda."
  )

  const years = (params.yearSkies ?? []).map((sky) => ({
    sky,
    love: yearLoveHit(sky, natal),
    loveHard: yearLoveHard(sky, natal),
    career: yearCareerHit(sky, natal),
    careerHard: yearCareerHard(sky, natal)
  }))

  if (years.length) {
    const nowYear = new Date().getFullYear()
    const future = years.filter((item) => item.sky.year >= nowYear)
    const pool = future.length ? future : years

    const expand = (
      peak: (typeof years)[number],
      scoreOf: (row: (typeof years)[number]) => number,
      high: boolean
    ) => {
      const byYear = new Map(years.map((item) => [item.sky.year, item]))
      const peakScore = scoreOf(peak)
      const floor = high ? peakScore - 1.5 : peakScore + 1.5
      const taken = [peak]
      let left = peak.sky.year - 1
      while (byYear.has(left)) {
        const row = byYear.get(left)
        if (!row) break
        const ok = high ? scoreOf(row) >= floor : scoreOf(row) <= floor
        if (!ok) break
        taken.unshift(row)
        left -= 1
      }
      let right = peak.sky.year + 1
      while (byYear.has(right)) {
        const row = byYear.get(right)
        if (!row) break
        const ok = high ? scoreOf(row) >= floor : scoreOf(row) <= floor
        if (!ok) break
        taken.push(row)
        right += 1
      }
      return taken
    }

    const pickPeaks = (
      source: typeof years,
      scoreOf: (row: (typeof years)[number]) => number,
      high: boolean
    ) => {
      const near = source.filter((item) => item.sky.year <= nowYear + 18)
      const seed = near.length ? near : source
      const first = [...seed].sort((a, b) => (high ? scoreOf(b) - scoreOf(a) : scoreOf(a) - scoreOf(b)))[0]
      const ranked = [...source].sort((a, b) => (high ? scoreOf(b) - scoreOf(a) : scoreOf(a) - scoreOf(b)))
      const picked: typeof years = first ? [first] : []
      ranked.forEach((row) => {
        if (picked.some((item) => Math.abs(item.sky.year - row.sky.year) < 8)) return
        picked.push(row)
      })
      return picked.slice(0, 3)
    }

    const rangeOf = (group: typeof years) => {
      const first = group[0].sky.year
      const last = group[group.length - 1].sky.year
      const core = first === last ? `${first}` : `${first}–${last}`
      if (last < nowYear) return `${core} (geçti)`
      if (first <= nowYear && last >= nowYear) return `${core} (içindeyiz)`
      return core
    }

    const loveLineFor = (group: typeof years) => {
      const peak = [...group].sort((a, b) => b.love.score - a.love.score)[0]
      return isMarriageHit(peak.love)
        ? `${rangeOf(group)}: EVET — evlilik / resmi bağ tavanı.${cite(peak.love)}`
        : `${rangeOf(group)}: EVET — ilişki ısınır.${cite(peak.love)}`
    }

    const loveHardLine = (group: typeof years) => {
      const peak = [...group].sort((a, b) => a.loveHard.score - b.loveHard.score)[0]
      return `${rangeOf(group)}: HAYIR — evlilik / resmi bağ yok.${cite(peak.loveHard)}`
    }

    const workLineFor = (group: typeof years) => {
      const peak = [...group].sort((a, b) => b.career.score - a.career.score)[0]
      return `${rangeOf(group)}: EVET — kariyer tavanı.${cite(peak.career)}`
    }

    const workHardLine = (group: typeof years) => {
      const peak = [...group].sort((a, b) => a.careerHard.score - b.careerHard.score)[0]
      return `${rangeOf(group)}: HAYIR — imza / unvan yok.${cite(peak.careerHard)}`
    }

    pickPeaks(pool, (item) => item.love.score, true).forEach((peak) => {
      loveBest.push(loveLineFor(expand(peak, (item) => item.love.score, true)))
    })
    pickPeaks(pool, (item) => item.loveHard.score, false).forEach((peak) => {
      loveWorst.push(loveHardLine(expand(peak, (item) => item.loveHard.score, false)))
    })
    pickPeaks(pool, (item) => item.career.score, true).forEach((peak) => {
      careerBest.push(workLineFor(expand(peak, (item) => item.career.score, true)))
    })
    pickPeaks(pool, (item) => item.careerHard.score, false).forEach((peak) => {
      careerWorst.push(workHardLine(expand(peak, (item) => item.careerHard.score, false)))
    })
  }

  const lane = (month: string, title: string, tone: TransitTone, items: string[]): TransitWindow => ({
    month,
    tone,
    title,
    detail: items[0] ?? title,
    items: items.filter((item, index, list) => list.indexOf(item) === index).slice(0, 8)
  })

  return [
    lane("Aşk ve evlilik", "En iyi tarihler", "luck", loveBest),
    lane("Aşk ve evlilik", "En kötü tarihler", "caution", loveWorst),
    lane("Kariyer", "En uygun tarihler", "luck", careerBest),
    lane("Kariyer", "En kötü dönemler", "caution", careerWorst)
  ]
}

export const buildLifeWindows = (params: {
  house7: HouseCusp
  house10: HouseCusp
  house5: HouseCusp
  house2: HouseCusp
  venus?: Placement
  jupiter?: Placement
  saturn?: Placement
  sun: Placement
  moon: Placement
  rising?: Placement
  midheaven?: Placement
  skies?: YearlySky[]
}): LifeWindow[] => {
  const natal: NatalPoints = {
    sun: params.sun,
    moon: params.moon,
    venus: params.venus,
    rising: params.rising,
    midheaven: params.midheaven
  }
  const skies = params.skies?.length ? params.skies : syntheticYearlySkies(params)
  const love = LOVE[params.house7.sign]
  const career = CAREER[params.house10.sign]
  const scored = skies.map((sky) => ({
    sky,
    love: yearLoveHit(sky, natal),
    loveHard: yearLoveHard(sky, natal),
    career: yearCareerHit(sky, natal),
    careerHard: yearCareerHard(sky, natal)
  }))

  const peakLove = [...scored].sort((a, b) => b.love.score - a.love.score)[0]
  const hardLove = [...scored].sort((a, b) => a.loveHard.score - b.loveHard.score)[0]
  const peakWork = [...scored].sort((a, b) => b.career.score - a.career.score)[0]
  const hardWork = [...scored].sort((a, b) => a.careerHard.score - b.careerHard.score)[0]

  const summary: LifeWindow = {
    period: `${skies[0]?.year ?? ""}-${skies[skies.length - 1]?.year ?? ""}`,
    title: "Hayat özeti — en iyi / en kötü",
    items: [
      peakLove ? `Aşk tavanı: ${peakLove.sky.year}.${cite(peakLove.love)}` : "Aşk tavanı hesaplanamadı.",
      hardLove ? `Aşk dip: ${hardLove.sky.year}.${cite(hardLove.loveHard)}` : "Aşk dip hesaplanamadı.",
      peakWork ? `Kariyer tavanı: ${peakWork.sky.year}.${cite(peakWork.career)}` : "Kariyer tavanı hesaplanamadı.",
      hardWork ? `Kariyer dip: ${hardWork.sky.year}.${cite(hardWork.careerHard)}` : "Kariyer dip hesaplanamadı.",
      `Natal pusula: 7. ev ${params.house7.signLabel} (${love.feelings[0]}), 10. ev ${params.house10.signLabel} (${career.jobs[0]}).`
    ]
  }

  const firstYear = skies[0]?.year ?? new Date().getFullYear()
  const lastYear = skies[skies.length - 1]?.year ?? firstYear
  const decades: LifeWindow[] = []
  for (let decade = Math.floor(firstYear / 10) * 10; decade <= lastYear; decade += 10) {
    const slice = scored.filter((item) => item.sky.year >= decade && item.sky.year <= decade + 9)
    if (!slice.length) continue
    const bestLove = [...slice].sort((a, b) => b.love.score - a.love.score)[0]
    const worstLove = [...slice].sort((a, b) => a.loveHard.score - b.loveHard.score)[0]
    const bestWork = [...slice].sort((a, b) => b.career.score - a.career.score)[0]
    const worstWork = [...slice].sort((a, b) => a.careerHard.score - b.careerHard.score)[0]
    decades.push({
      period: `${decade}-${decade + 9}`,
      title: `${decade}'ler`,
      items: [
        `Aşk en iyi: ${bestLove.sky.year}.${cite(bestLove.love)}`,
        `Aşk en kötü: ${worstLove.sky.year}.${cite(worstLove.loveHard)}`,
        `Kariyer en iyi: ${bestWork.sky.year}.${cite(bestWork.career)}`,
        `Kariyer en kötü: ${worstWork.sky.year}.${cite(worstWork.careerHard)}`
      ]
    })
  }

  return [summary, ...decades]
}
