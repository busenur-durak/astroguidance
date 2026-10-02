import { createHmac, randomBytes } from "crypto"
import { request as httpsRequest } from "https"
import { REPORT_CATALOG } from "@/lib/catalog"
import type { ReportId } from "@/lib/types"

export type IyzicoInitResult = {
  status?: string
  errorMessage?: string
  token?: string
  paymentPageUrl?: string
  checkoutFormContent?: string
}

export type IyzicoRetrieveResult = {
  status?: string
  paymentStatus?: string
  fraudStatus?: number
  errorMessage?: string
  conversationId?: string
  token?: string
}

const INIT_PATH = "/payment/iyzipos/checkoutform/initialize/auth/ecom"
const DETAIL_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const formatPrice = (price: number | string) => {
  const result = Number.parseFloat(String(price)).toString()
  return result.includes(".") ? result : `${result}.0`
}

const splitName = (full: string) => {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) return { name: parts[0] ?? "Musteri", surname: "AstroGuidance" }
  return { name: parts[0], surname: parts.slice(1).join(" ") }
}

export const appUrl = () => {
  const raw = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return raw.replace(/\/$/, "")
}

export const isIyzicoReady = () => Boolean(process.env.IYZI_API_KEY && process.env.IYZI_SECRET_KEY)

export const paymentProvider = () => {
  if (isIyzicoReady()) return "iyzico" as const
  if (process.env.NODE_ENV === "production") return "blocked" as const
  return "mock" as const
}

const iyzicoUri = () =>
  (process.env.IYZI_BASE_URL ??
    (process.env.IYZI_MODE === "live" ? "https://api.iyzipay.com" : "https://sandbox-api.iyzipay.com")).replace(
    /\/$/,
    ""
  )

export const toGsm = (phone: string) => {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("90") && digits.length >= 12) return `+${digits}`
  if (digits.startsWith("0") && digits.length >= 11) return `+90${digits.slice(1)}`
  if (digits.length === 10) return `+90${digits}`
  return `+90${digits}`
}

const isNetworkError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  const cause =
    error instanceof Error && error.cause instanceof Error ? error.cause.message : ""
  const text = `${message} ${cause}`
  return /ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|fetch failed|socket hang up|undici/i.test(text)
}

const paymentError = (error: unknown) => {
  if (isNetworkError(error)) {
    return new Error("Iyzico şu an yanıt vermedi. Biraz sonra tekrar dene.")
  }
  return error instanceof Error ? error : new Error("Ödeme alınamadı")
}

const authorization = (path: string, payload: string) => {
  const apiKey = process.env.IYZI_API_KEY ?? ""
  const secretKey = process.env.IYZI_SECRET_KEY ?? ""
  const randomKey = `${Date.now()}${randomBytes(8).toString("hex")}`
  const signature = createHmac("sha256", secretKey).update(randomKey + path + payload).digest("hex")
  const token = Buffer.from(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`).toString("base64")
  return {
    Authorization: `IYZWSv2 ${token}`,
    "x-iyzi-rnd": randomKey,
    "x-iyzi-client-version": "astroguidance-https",
    "Content-Type": "application/json",
    Accept: "application/json",
    Connection: "close"
  }
}

const postOnce = <T>(path: string, payload: string) =>
  new Promise<T>((resolve, reject) => {
    const host = new URL(iyzicoUri()).hostname
    const headers = authorization(path, payload)
    const req = httpsRequest(
      {
        protocol: "https:",
        hostname: host,
        port: 443,
        path,
        method: "POST",
        family: 4,
        timeout: 20000,
        headers: {
          ...headers,
          "Content-Length": String(Buffer.byteLength(payload))
        }
      },
      (response) => {
        const chunks: Buffer[] = []
        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        })
        response.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8")
          try {
            resolve(JSON.parse(raw) as T)
          } catch {
            reject(new Error(raw || `Iyzico HTTP ${response.statusCode}`))
          }
        })
      }
    )
    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy(new Error("ETIMEDOUT"))
    })
    req.write(payload)
    req.end()
  })

const postIyzico = async <T>(path: string, body: unknown, attempt = 0): Promise<T> => {
  try {
    return await postOnce<T>(path, JSON.stringify(body))
  } catch (error) {
    if (attempt < 2 && isNetworkError(error)) {
      await sleep(400 * (attempt + 1))
      return postIyzico<T>(path, body, attempt + 1)
    }
    throw paymentError(error)
  }
}

export const startCheckout = async (input: {
  conversationId: string
  userId: string
  chartId: string
  reportId: ReportId
  payerName: string
  payerEmail: string
  payerPhone: string
  identityNumber: string
  ip: string
}) => {
  const catalog = REPORT_CATALOG[input.reportId]
  const price = formatPrice(catalog.amount)
  const { name, surname } = splitName(input.payerName)
  const gsmNumber = toGsm(input.payerPhone)
  const identityNumber = input.identityNumber.replace(/\D/g, "").padStart(11, "1").slice(0, 11)
  const address = {
    address: "Dijital teslimat — natal rapor",
    contactName: input.payerName,
    city: "Istanbul",
    country: "Turkey"
  }

  const body = {
    locale: "tr",
    conversationId: input.conversationId,
    price,
    basketId: input.chartId,
    paymentGroup: "PRODUCT",
    buyer: {
      id: input.userId,
      name,
      surname,
      identityNumber,
      email: input.payerEmail,
      gsmNumber,
      registrationAddress: address.address,
      city: address.city,
      country: address.country,
      ip: input.ip || "127.0.0.1"
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems: [
      {
        id: input.reportId,
        price,
        name: catalog.title,
        category1: "Natal rapor",
        itemType: "VIRTUAL"
      }
    ],
    callbackUrl: `${appUrl()}/api/payments/iyzico/callback`,
    currency: "TRY",
    paidPrice: price,
    enabledInstallments: [1]
  }

  const result = await postIyzico<IyzicoInitResult>(INIT_PATH, body)
  if (result.status !== "success" || !result.token) {
    throw new Error(result.errorMessage ?? "Iyzico ödeme formu açılamadı")
  }

  return {
    token: result.token,
    paymentUrl: result.paymentPageUrl ?? `${iyzicoUri().replace("api.", "cpp.")}?token=${result.token}`
  }
}

export const retrieveCheckout = async (token: string, conversationId?: string) => {
  const result = await postIyzico<IyzicoRetrieveResult>(DETAIL_PATH, {
    locale: "tr",
    conversationId: conversationId ?? token,
    token
  })
  const approved =
    result.paymentStatus === "SUCCESS" && (result.fraudStatus == null || result.fraudStatus === 1)
  return { ...result, approved }
}
