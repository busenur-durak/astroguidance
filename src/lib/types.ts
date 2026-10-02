export type SignKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces"

export type ElementKey = "fire" | "earth" | "air" | "water"
export type ModalityKey = "cardinal" | "fixed" | "mutable"

export type GeoPlace = {
  label: string
  latitude: number
  longitude: number
}

export type BirthInput = {
  name: string
  date: string
  time: string
  place: GeoPlace
}

export type Placement = {
  key: string
  label: string
  glyph: string
  sign: SignKey
  signLabel: string
  signGlyph: string
  formatted: string
  ecliptic: number
  horizon: number
  house: number
  retrograde: boolean
}

export type HouseCusp = {
  id: number
  label: string
  theme: string
  sign: SignKey
  signLabel: string
  signGlyph: string
  formatted: string
  ecliptic: number
  horizon: number
}

export type ElementBalance = {
  fire: number
  earth: number
  air: number
  water: number
  dominant: ElementKey
}

export type FreeAnalysis = {
  title: string
  summary: string
  strengths: string[]
  elementsText: string
}

export type ReportId = "love" | "career" | "timing" | "ask"

export type ReportSection = {
  title: string
  text?: string
  bullets?: string[]
}

export type LockedReport = {
  id: ReportId
  title: string
  price: string
  priceNote: string
  preview: string
  body: string
  highlights: string[]
  sections: ReportSection[]
}

export type PublicUser = {
  id: string
  name: string
  email: string
}

export type AskTurn = {
  question: string
  answer: string
}

export type TransitTone = "luck" | "focus" | "caution"

export type SkyBody = {
  house: number
  sign: SignKey
  ecliptic: number
}

export type MonthlySky = {
  year: number
  month: number
  venus: SkyBody
  mars: SkyBody
  jupiter: SkyBody
  saturn: SkyBody
  sun: SkyBody
  mercury: SkyBody
}

export type YearlySky = {
  year: number
  jupiter: SkyBody
  saturn: SkyBody
  venus: SkyBody
  samples: Array<{
    month: number
    jupiter: SkyBody
    saturn: SkyBody
    venus: SkyBody
  }>
}

export type ChartOrigin = {
  date: string
  time: string
  latitude: number
  longitude: number
}

export type TransitWindow = {
  month: string
  tone: TransitTone
  title: string
  detail: string
  items: string[]
}

export type LifeWindow = {
  period: string
  title: string
  items: string[]
}

export type NatalChartResult = {
  name: string
  placeLabel: string
  birthLabel: string
  timezone: string
  origin?: ChartOrigin
  sun: Placement
  moon: Placement
  rising: Placement
  midheaven: Placement
  bodies: Placement[]
  points: Placement[]
  houses: HouseCusp[]
  elements: ElementBalance
  analysis: FreeAnalysis
  reports: LockedReport[]
  transits: TransitWindow[]
  lifeWindows: LifeWindow[]
}

export type SavedChartRecord = {
  id: string
  userId: string
  createdAt: string
  unlocked: ReportId[]
  askLimit: number
  asks: AskTurn[]
  result: NatalChartResult
}

export type OrderStatus = "pending" | "paid" | "failed"

export type OrderRecord = {
  id: string
  userId: string
  chartId: string
  reportId: ReportId
  amount: number
  status: OrderStatus
  payerName: string
  payerEmail: string
  payerPhone: string
  paymentToken?: string
  createdAt: string
}

export type PendingPayment = {
  id: string
  userId: string
  chartId: string
  reportId: ReportId
  amount: number
  payerName: string
  payerEmail: string
  payerPhone: string
  token?: string
  status: OrderStatus
  createdAt: string
}
