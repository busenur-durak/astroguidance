import { Origin, Horoscope } from "circular-natal-horoscope-js"
import {
  HOUSE_THEMES,
  PLANET_META,
  resolveSignKey,
  SIGNS,
  SIGN_ORDER
} from "@/lib/signs"
import {
  attachTimingContent,
  buildAnalysis,
  buildReports,
  describeResultMeta,
  refreshChartInterpretation
} from "@/lib/interpret"
import { buildLifeWindows, buildTransits } from "@/lib/timing"
import type {
  BirthInput,
  ElementBalance,
  ElementKey,
  HouseCusp,
  MonthlySky,
  NatalChartResult,
  Placement,
  SkyBody,
  YearlySky
} from "@/lib/types"

type RawPoint = {
  key?: string
  label?: string
  isRetrograde?: boolean
  retrograde?: boolean
  House?: { id?: number }
  Sign?: { key?: string; label?: string }
  ChartPosition?: {
    Ecliptic?: { DecimalDegrees?: number; ArcDegreesFormatted30?: string }
    Horizon?: { DecimalDegrees?: number }
  }
}

type RawHouse = {
  id?: number
  Sign?: { key?: string; label?: string }
  ChartPosition?: {
    StartPosition?: {
      Ecliptic?: { DecimalDegrees?: number; ArcDegreesFormatted30?: string }
      Horizon?: { DecimalDegrees?: number }
    }
  }
}

const BODY_KEYS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto"
] as const

const POINT_KEYS = ["northnode", "southnode", "lilith"] as const

const wrap360 = (value: number) => {
  const result = value % 360
  return result < 0 ? result + 360 : result
}

const houseForDegree = (degree: number, cusps: number[]) => {
  for (let index = 0; index < 12; index += 1) {
    const start = cusps[index]
    const end = cusps[(index + 1) % 12]
    if (start < end) {
      if (degree >= start && degree < end) return index + 1
    } else if (degree >= start || degree < end) {
      return index + 1
    }
  }
  return 1
}

const toPlacement = (raw: RawPoint, key: string, houseCusps: number[]): Placement => {
  const meta = PLANET_META[key] ?? { label: raw.label ?? key, glyph: "•" }
  const ecliptic = wrap360(raw.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0)
  const sign = resolveSignKey(raw.Sign?.key ?? raw.Sign?.label)
  const signInfo = SIGNS[sign]
  return {
    key,
    label: meta.label,
    glyph: meta.glyph,
    sign,
    signLabel: signInfo.label,
    signGlyph: signInfo.glyph,
    formatted: raw.ChartPosition?.Ecliptic?.ArcDegreesFormatted30 ?? `${(ecliptic % 30).toFixed(1)}°`,
    ecliptic,
    horizon: wrap360(raw.ChartPosition?.Horizon?.DecimalDegrees ?? 0),
    house: raw.House?.id ?? houseForDegree(ecliptic, houseCusps),
    retrograde: Boolean(raw.isRetrograde ?? raw.retrograde)
  }
}

const toHouse = (raw: RawHouse, index: number): HouseCusp => {
  const id = raw.id ?? index + 1
  const sign = resolveSignKey(raw.Sign?.key ?? raw.Sign?.label)
  const signInfo = SIGNS[sign]
  const ecliptic = wrap360(raw.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees ?? index * 30)
  return {
    id,
    label: `${id}. Ev`,
    theme: HOUSE_THEMES[id - 1] ?? "",
    sign,
    signLabel: signInfo.label,
    signGlyph: signInfo.glyph,
    formatted: raw.ChartPosition?.StartPosition?.Ecliptic?.ArcDegreesFormatted30 ?? `${(ecliptic % 30).toFixed(1)}°`,
    ecliptic,
    horizon: wrap360(raw.ChartPosition?.StartPosition?.Horizon?.DecimalDegrees ?? 0)
  }
}

const elementBalance = (placements: Placement[]): ElementBalance => {
  const counts: Record<ElementKey, number> = { fire: 0, earth: 0, air: 0, water: 0 }
  placements.forEach((item) => {
    counts[SIGNS[item.sign].element] += 1
  })
  const dominant = (Object.keys(counts) as ElementKey[]).reduce((best, key) =>
    counts[key] > counts[best] ? key : best
  )
  return { ...counts, dominant }
}

const parseBirth = (input: BirthInput) => {
  const [year, month, day] = input.date.split("-").map(Number)
  const [hour, minute] = input.time.split(":").map(Number)
  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("Doğum tarihi veya saati eksik")
  }
  if (!Number.isFinite(input.place.latitude) || !Number.isFinite(input.place.longitude)) {
    throw new Error("Doğum yeri koordinatı eksik")
  }
  return { year, month, day, hour, minute }
}

const createHoroscope = (input: BirthInput, when?: { year: number; month: number; day: number; hour: number; minute: number }) => {
  const parsed = when ?? parseBirth(input)
  const origin = new Origin({
    year: parsed.year,
    month: parsed.month - 1,
    date: parsed.day,
    hour: parsed.hour,
    minute: parsed.minute,
    latitude: input.place.latitude,
    longitude: input.place.longitude
  })

  return new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major"],
    customOrbs: {},
    language: "en"
  })
}

const skyBody = (raw: RawPoint, key: string, cusps: number[]): SkyBody => {
  const placement = toPlacement(raw, key, cusps)
  return {
    house: houseForDegree(placement.ecliptic, cusps),
    sign: placement.sign,
    ecliptic: placement.ecliptic
  }
}

const skyAt = (input: BirthInput, cusps: number[], when: { year: number; month: number; day: number }): {
  venus: SkyBody
  mars: SkyBody
  jupiter: SkyBody
  saturn: SkyBody
  sun: SkyBody
  mercury: SkyBody
} => {
  const horoscope = createHoroscope(input, { ...when, hour: 12, minute: 0 }) as unknown as {
    CelestialBodies?: Record<string, RawPoint>
  }
  const bodies = horoscope.CelestialBodies ?? {}
  return {
    venus: skyBody(bodies.venus ?? { key: "venus" }, "venus", cusps),
    mars: skyBody(bodies.mars ?? { key: "mars" }, "mars", cusps),
    jupiter: skyBody(bodies.jupiter ?? { key: "jupiter" }, "jupiter", cusps),
    saturn: skyBody(bodies.saturn ?? { key: "saturn" }, "saturn", cusps),
    sun: skyBody(bodies.sun ?? { key: "sun" }, "sun", cusps),
    mercury: skyBody(bodies.mercury ?? { key: "mercury" }, "mercury", cusps)
  }
}

export const computeMonthlySkies = (input: BirthInput, cusps: number[]): MonthlySky[] => {
  const start = new Date()
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 12)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      ...skyAt(input, cusps, {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 12
      })
    }
  })
}

const JUPITER_YEAR = 30.348
const SATURN_YEAR = 12.221

const signFromEcliptic = (ecliptic: number) => SIGN_ORDER[Math.floor(wrap360(ecliptic) / 30) % 12]

const projectBody = (body: SkyBody, delta: number, cusps: number[]): SkyBody => {
  const ecliptic = wrap360(body.ecliptic + delta)
  return {
    ecliptic,
    house: houseForDegree(ecliptic, cusps),
    sign: signFromEcliptic(ecliptic)
  }
}

const lifeSpan = (birthYear: number, now: number) => ({
  start: birthYear + 14,
  end: Math.max(birthYear + 88, now + 45)
})

export const computeYearlySkies = (input: BirthInput, cusps: number[]): YearlySky[] => {
  const now = new Date().getFullYear()
  const birthYear = Number(input.date.slice(0, 4)) || now - 30
  const { start, end } = lifeSpan(birthYear, now)
  const ref = skyAt(input, cusps, { year: now, month: 6, day: 15 })

  const projected = Array.from({ length: end - start + 1 }, (_, index) => {
    const year = start + index
    const drift = year - now
    const jupiter = projectBody(ref.jupiter, drift * JUPITER_YEAR, cusps)
    const saturn = projectBody(ref.saturn, drift * SATURN_YEAR, cusps)
    return {
      year,
      jupiter,
      saturn,
      venus: ref.venus,
      samples: [{ month: 6, jupiter, saturn, venus: ref.venus }]
    }
  })

  projected.forEach((item) => {
    const near = item.year >= now && item.year <= now + 6
    const keyHouse = item.jupiter.house === 7 || item.jupiter.house === 10 || item.saturn.house === 7 || item.saturn.house === 10
    if (!near && !keyHouse) return
    const months = near ? [3, 6, 10] : [6]
    const samples = months.map((month) => {
      const sky = skyAt(input, cusps, { year: item.year, month, day: 15 })
      return { month, jupiter: sky.jupiter, saturn: sky.saturn, venus: sky.venus }
    })
    const mid = samples.find((sample) => sample.month === 6) ?? samples[0]
    item.jupiter = mid.jupiter
    item.saturn = mid.saturn
    item.venus = mid.venus
    item.samples = samples
  })

  return projected
}

export const hydrateChartResult = (chart: NatalChartResult): NatalChartResult => {
  if (!chart.origin) return refreshChartInterpretation(chart)

  return calculateNatalChart({
    name: chart.name,
    date: chart.origin.date,
    time: chart.origin.time,
    place: {
      label: chart.placeLabel,
      latitude: chart.origin.latitude,
      longitude: chart.origin.longitude
    }
  })
}

export const calculateNatalChart = (input: BirthInput): NatalChartResult => {
  const horoscope = createHoroscope(input) as unknown as {
    origin?: { timezone?: string | { name?: string } }
    Ascendant?: RawPoint
    Midheaven?: RawPoint
    CelestialBodies?: Record<string, RawPoint>
    CelestialPoints?: Record<string, RawPoint>
    Houses?: RawHouse[]
  }

  const houses = (horoscope.Houses ?? []).slice(0, 12).map((house, index) => toHouse(house, index))
  while (houses.length < 12) {
    const index = houses.length
    const sign = SIGN_ORDER[index]
    houses.push({
      id: index + 1,
      label: `${index + 1}. Ev`,
      theme: HOUSE_THEMES[index],
      sign,
      signLabel: SIGNS[sign].label,
      signGlyph: SIGNS[sign].glyph,
      formatted: "0°",
      ecliptic: index * 30,
      horizon: index * 30
    })
  }

  const cusps = houses.map((house) => house.ecliptic)
  const bodies = BODY_KEYS.map((key) => toPlacement(horoscope.CelestialBodies?.[key] ?? { key }, key, cusps))
  const points = POINT_KEYS.map((key) => toPlacement(horoscope.CelestialPoints?.[key] ?? { key }, key, cusps))
  const rising = toPlacement(horoscope.Ascendant ?? { key: "ascendant" }, "ascendant", cusps)
  const midheaven = toPlacement(horoscope.Midheaven ?? { key: "midheaven" }, "midheaven", cusps)
  const sun = bodies.find((item) => item.key === "sun") ?? bodies[0]
  const moon = bodies.find((item) => item.key === "moon") ?? bodies[1]
  rising.house = 1

  const elements = elementBalance([sun, moon, rising, ...bodies.filter((item) => item.key !== "sun" && item.key !== "moon")])
  const analysis = buildAnalysis({ name: input.name, sun, moon, rising, elements })
  const venus = bodies.find((item) => item.key === "venus")
  const mars = bodies.find((item) => item.key === "mars")
  const saturn = bodies.find((item) => item.key === "saturn")
  const jupiter = bodies.find((item) => item.key === "jupiter")

  const reports = buildReports({
    name: input.name,
    sun,
    moon,
    rising,
    midheaven,
    venus,
    mars,
    saturn,
    jupiter,
    houses
  })

  const skies = computeMonthlySkies(input, cusps)
  const yearSkies = computeYearlySkies(input, cusps)
  const transits = buildTransits({
    skies,
    yearSkies,
    sun,
    moon,
    venus,
    mars,
    rising,
    midheaven
  })
  const lifeWindows = buildLifeWindows({
    house7: houses[6],
    house10: houses[9],
    house5: houses[4],
    house2: houses[1],
    venus,
    jupiter,
    saturn,
    sun,
    moon,
    rising,
    midheaven,
    skies: yearSkies
  })
  attachTimingContent({ reports, transits, lifeWindows })

  const timezoneName =
    typeof horoscope.origin?.timezone === "string"
      ? horoscope.origin.timezone
      : horoscope.origin?.timezone?.name ?? "yerel saat"

  return {
    ...describeResultMeta({
      name: input.name,
      placeLabel: input.place.label,
      date: input.date,
      time: input.time,
      timezone: timezoneName
    }),
    origin: {
      date: input.date,
      time: input.time,
      latitude: input.place.latitude,
      longitude: input.place.longitude
    },
    sun,
    moon,
    rising,
    midheaven,
    bodies,
    points,
    houses,
    elements,
    analysis,
    reports,
    transits,
    lifeWindows
  }
}

