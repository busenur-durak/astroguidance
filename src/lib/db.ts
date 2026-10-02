import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { hydrateChartResult } from "@/lib/chart"
import { ASK_PACK_SIZE, isPackProduct, remainingAsks } from "@/lib/catalog"
import type {
  AskTurn,
  NatalChartResult,
  OrderRecord,
  PendingPayment,
  PublicUser,
  ReportId,
  SavedChartRecord
} from "@/lib/types"

type UserRecord = PublicUser & {
  passwordHash: string
  createdAt: string
}

type Database = {
  users: UserRecord[]
  charts: SavedChartRecord[]
  orders: OrderRecord[]
  pending: PendingPayment[]
}

const dataDir =
  process.env.DATA_DIR ??
  process.env.RAILWAY_VOLUME_MOUNT_PATH ??
  path.join(process.cwd(), "data")

const dbPath = path.join(dataDir, "db.json")

const emptyDb = (): Database => ({ users: [], charts: [], orders: [], pending: [] })

let queue: Promise<unknown> = Promise.resolve()

const withLock = async <T>(task: () => Promise<T>) => {
  const run = queue.then(task, task)
  queue = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

const normalizeChart = (chart: SavedChartRecord) => {
  if (chart.askLimit == null) {
    chart.askLimit = chart.unlocked.includes("ask") ? ASK_PACK_SIZE : 0
  }
  return chart
}

const readDb = async () => {
  try {
    const raw = await readFile(dbPath, "utf8")
    const parsed = JSON.parse(raw) as Partial<Database>
    return {
      users: parsed.users ?? [],
      charts: (parsed.charts ?? []).map(normalizeChart),
      orders: parsed.orders ?? [],
      pending: parsed.pending ?? []
    } satisfies Database
  } catch {
    return emptyDb()
  }
}

const writeDb = async (db: Database) => {
  await mkdir(path.dirname(dbPath), { recursive: true })
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8")
}

export const publicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email
})

export const createUser = async (input: { name: string; email: string; passwordHash: string }) =>
  withLock(async () => {
    const db = await readDb()
    const email = input.email.toLowerCase()
    if (db.users.some((user) => user.email === email)) {
      throw new Error("Bu e-posta ile kayıt zaten var")
    }
    const user: UserRecord = {
      id: crypto.randomUUID(),
      name: input.name,
      email,
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString()
    }
    db.users.push(user)
    await writeDb(db)
    return user
  })

export const findUserByEmail = async (email: string) => {
  const db = await readDb()
  return db.users.find((user) => user.email === email.toLowerCase()) ?? null
}

export const findUserById = async (id: string) => {
  const db = await readDb()
  return db.users.find((user) => user.id === id) ?? null
}

export const saveChart = async (input: { userId: string; result: NatalChartResult }) =>
  withLock(async () => {
    const db = await readDb()
    const existing = db.charts.find(
      (chart) =>
        chart.userId === input.userId &&
        chart.result.birthLabel === input.result.birthLabel &&
        chart.result.placeLabel === input.result.placeLabel &&
        chart.result.name === input.result.name
    )
    if (existing) {
      existing.result = input.result
      await writeDb(db)
      return existing
    }
    const record: SavedChartRecord = {
      id: crypto.randomUUID(),
      userId: input.userId,
      createdAt: new Date().toISOString(),
      unlocked: [],
      askLimit: 0,
      asks: [],
      result: input.result
    }
    db.charts.unshift(record)
    await writeDb(db)
    return record
  })

export const listCharts = async (userId: string) => {
  const db = await readDb()
  return db.charts.filter((chart) => chart.userId === userId)
}

export const getChart = async (id: string, userId: string) =>
  withLock(async () => {
    const db = await readDb()
    const chart = db.charts.find((item) => item.id === id && item.userId === userId)
    if (!chart) return null
    chart.result = hydrateChartResult(chart.result)
    await writeDb(db)
    return chart
  })

export const unlockReport = async (input: {
  userId: string
  chartId: string
  reportId: ReportId
  payerName: string
  payerEmail: string
  payerPhone: string
  amount: number
}) =>
  withLock(async () => {
    const db = await readDb()
    const chart = db.charts.find((item) => item.id === input.chartId && item.userId === input.userId)
    if (!chart) {
      throw new Error("Harita bulunamadı")
    }
    if (isPackProduct(input.reportId)) {
      chart.askLimit = (chart.askLimit ?? 0) + ASK_PACK_SIZE
      if (!chart.unlocked.includes(input.reportId)) {
        chart.unlocked.push(input.reportId)
      }
    } else if (chart.unlocked.includes(input.reportId)) {
      throw new Error("Bu rapor bu haritada zaten açık. Yeni natal için yeni harita çıkar; orada yeniden alınır.")
    } else {
      chart.unlocked.push(input.reportId)
    }
    const order: OrderRecord = {
      id: `AG-${Date.now().toString(36).toUpperCase()}`,
      userId: input.userId,
      chartId: input.chartId,
      reportId: input.reportId,
      amount: input.amount,
      status: "paid",
      payerName: input.payerName,
      payerEmail: input.payerEmail,
      payerPhone: input.payerPhone,
      createdAt: new Date().toISOString()
    }
    db.orders.unshift(order)
    await writeDb(db)
    return { chart, order }
  })

export const createPendingPayment = async (input: Omit<PendingPayment, "id" | "status" | "createdAt" | "token">) =>
  withLock(async () => {
    const db = await readDb()
    const pending: PendingPayment = {
      ...input,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString()
    }
    db.pending.unshift(pending)
    await writeDb(db)
    return pending
  })

export const attachPaymentToken = async (id: string, token: string) =>
  withLock(async () => {
    const db = await readDb()
    const pending = db.pending.find((item) => item.id === id)
    if (!pending) throw new Error("Ödeme oturumu bulunamadı")
    pending.token = token
    await writeDb(db)
    return pending
  })

export const fulfillPendingPayment = async (input: { id?: string; token?: string }) =>
  withLock(async () => {
    const db = await readDb()
    const pending = db.pending.find(
      (item) => (input.id && item.id === input.id) || (input.token && item.token === input.token)
    )
    if (!pending) {
      throw new Error("Ödeme kaydı bulunamadı")
    }
    const chart = db.charts.find((item) => item.id === pending.chartId && item.userId === pending.userId)
    if (!chart) {
      throw new Error("Harita bulunamadı")
    }
    if (pending.status === "paid") {
      return { chart, pending, already: true }
    }
    if (isPackProduct(pending.reportId)) {
      chart.askLimit = (chart.askLimit ?? 0) + ASK_PACK_SIZE
      if (!chart.unlocked.includes(pending.reportId)) {
        chart.unlocked.push(pending.reportId)
      }
    } else if (!chart.unlocked.includes(pending.reportId)) {
      chart.unlocked.push(pending.reportId)
    }
    pending.status = "paid"
    const order: OrderRecord = {
      id: `AG-${Date.now().toString(36).toUpperCase()}`,
      userId: pending.userId,
      chartId: pending.chartId,
      reportId: pending.reportId,
      amount: pending.amount,
      status: "paid",
      payerName: pending.payerName,
      payerEmail: pending.payerEmail,
      payerPhone: pending.payerPhone,
      paymentToken: pending.token,
      createdAt: new Date().toISOString()
    }
    db.orders.unshift(order)
    await writeDb(db)
    return { chart, pending, already: false }
  })

export const failPendingPayment = async (input: { id?: string; token?: string }) =>
  withLock(async () => {
    const db = await readDb()
    const pending = db.pending.find(
      (item) => (input.id && item.id === input.id) || (input.token && item.token === input.token)
    )
    if (pending && pending.status === "pending") {
      pending.status = "failed"
      await writeDb(db)
    }
    return pending ?? null
  })

export const listOrders = async (userId: string) => {
  const db = await readDb()
  return db.orders.filter((order) => order.userId === userId)
}

export const addAsk = async (input: { userId: string; chartId: string; turn: AskTurn }) =>
  withLock(async () => {
    const db = await readDb()
    const chart = db.charts.find((item) => item.id === input.chartId && item.userId === input.userId)
    if (!chart) {
      throw new Error("Harita bulunamadı")
    }
    if (!chart.unlocked.includes("ask") || remainingAsks(chart.askLimit, chart.asks.length) <= 0) {
      throw new Error("Soru hakkın bitti. 3 soruluk paketi tekrar alabilirsin.")
    }
    chart.asks.push(input.turn)
    await writeDb(db)
    return chart
  })
