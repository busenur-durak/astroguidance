import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { REPORT_CATALOG, isReportId, remainingAsks } from "@/lib/catalog"
import { calculateNatalChart } from "@/lib/chart"
import { attachPaymentToken, createPendingPayment, saveChart, unlockReport } from "@/lib/db"
import { paymentProvider, startCheckout } from "@/lib/payment"
import type { BirthInput } from "@/lib/types"

export const runtime = "nodejs"

const clientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "127.0.0.1"
  return request.headers.get("x-real-ip") ?? "127.0.0.1"
}

export const GET = async () => {
  const provider = paymentProvider()
  return NextResponse.json({
    provider,
    ready: provider !== "blocked"
  })
}

export const POST = async (request: Request) => {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Satın almak için giriş yap" }, { status: 401 })
    }

    const provider = paymentProvider()
    if (provider === "blocked") {
      return NextResponse.json(
        { error: "Canlı ödeme henüz bağlanmadı. IYZI_API_KEY ve IYZI_SECRET_KEY gerekli." },
        { status: 503 }
      )
    }

    const body = (await request.json()) as {
      chartId?: string
      reportId?: string
      payerName?: string
      payerEmail?: string
      payerPhone?: string
      identityNumber?: string
      birth?: BirthInput
    }

    const reportId = body.reportId ?? ""
    if (!isReportId(reportId)) {
      return NextResponse.json({ error: "Geçersiz rapor" }, { status: 400 })
    }

    const payerName = body.payerName?.trim() ?? user.name
    const payerEmail = body.payerEmail?.trim() ?? user.email
    const payerPhone = body.payerPhone?.trim() ?? ""
    if (payerName.length < 2 || !payerEmail.includes("@") || payerPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Ad, e-posta ve 10 haneli telefon gerekli" },
        { status: 400 }
      )
    }

    let chartId = body.chartId
    if (!chartId) {
      if (!body.birth?.name || !body.birth.date || !body.birth.time || !body.birth.place) {
        return NextResponse.json({ error: "Harita bilgisi eksik" }, { status: 400 })
      }
      const calculated = calculateNatalChart(body.birth)
      const saved = await saveChart({ userId: user.id, result: calculated })
      chartId = saved.id
    }

    const catalog = REPORT_CATALOG[reportId]

    if (provider === "mock") {
      const { chart, order } = await unlockReport({
        userId: user.id,
        chartId,
        reportId,
        payerName,
        payerEmail,
        payerPhone,
        amount: catalog.amount
      })
      return NextResponse.json({
        mode: "mock",
        order,
        chartId: chart.id,
        unlocked: chart.unlocked,
        askLimit: chart.askLimit,
        remainingAsks: remainingAsks(chart.askLimit, chart.asks.length),
        chart: chart.result
      })
    }

    const pending = await createPendingPayment({
      userId: user.id,
      chartId,
      reportId,
      amount: catalog.amount,
      payerName,
      payerEmail,
      payerPhone
    })

    const checkout = await startCheckout({
      conversationId: pending.id,
      userId: user.id,
      chartId,
      reportId,
      payerName,
      payerEmail,
      payerPhone,
      identityNumber: body.identityNumber ?? "",
      ip: clientIp(request)
    })
    await attachPaymentToken(pending.id, checkout.token)

    return NextResponse.json({
      mode: "iyzico",
      paymentUrl: checkout.paymentUrl,
      conversationId: pending.id,
      chartId
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ödeme alınamadı"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
