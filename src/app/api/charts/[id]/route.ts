import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { getChart } from "@/lib/db"

export const runtime = "nodejs"

export const GET = async (
  _request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
  }
  const { id } = await context.params
  const chart = await getChart(id, user.id)
  if (!chart) {
    return NextResponse.json({ error: "Harita bulunamadı" }, { status: 404 })
  }
  return NextResponse.json({
    chart: chart.result,
    chartId: chart.id,
    unlocked: chart.unlocked,
    askLimit: chart.askLimit,
    asks: chart.asks
  })
}
