import { NextResponse } from "next/server"
import { failPendingPayment, fulfillPendingPayment } from "@/lib/db"
import { appUrl, retrieveCheckout } from "@/lib/payment"

export const runtime = "nodejs"

const redirectTo = (chartId: string | undefined, state: "ok" | "hata") => {
  const url = new URL("/harita", appUrl())
  if (chartId) url.searchParams.set("id", chartId)
  url.searchParams.set("odeme", state)
  return NextResponse.redirect(url, 303)
}

const readToken = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { token?: string; conversationId?: string }
    return { token: body.token ?? "", conversationId: body.conversationId }
  }
  const form = await request.formData()
  return {
    token: String(form.get("token") ?? ""),
    conversationId: form.get("conversationId") ? String(form.get("conversationId")) : undefined
  }
}

const settle = async (token: string, conversationId?: string) => {
  if (!token) return redirectTo(undefined, "hata")
  const result = await retrieveCheckout(token, conversationId)
  const id = conversationId ?? result.conversationId
  if (result.approved) {
    const fulfilled = await fulfillPendingPayment({ id, token })
    return redirectTo(fulfilled.chart.id, "ok")
  }
  const failed = await failPendingPayment({ id, token })
  return redirectTo(failed?.chartId, "hata")
}

export const POST = async (request: Request) => {
  try {
    const { token, conversationId } = await readToken(request)
    return await settle(token, conversationId)
  } catch {
    return redirectTo(undefined, "hata")
  }
}

export const GET = async (request: Request) => {
  const url = new URL(request.url)
  try {
    return await settle(url.searchParams.get("token") ?? "", url.searchParams.get("conversationId") ?? undefined)
  } catch {
    return redirectTo(undefined, "hata")
  }
}
