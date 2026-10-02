import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { remainingAsks } from "@/lib/catalog"
import { listCharts, listOrders } from "@/lib/db"

export const runtime = "nodejs"

export const GET = async () => {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
  }
  const charts = await listCharts(user.id)
  const orders = await listOrders(user.id)
  return NextResponse.json({
    user,
    charts: charts.map((chart) => ({
      id: chart.id,
      createdAt: chart.createdAt,
      unlocked: chart.unlocked,
      askLimit: chart.askLimit,
      remainingAsks: remainingAsks(chart.askLimit, chart.asks.length),
      name: chart.result.name,
      birthLabel: chart.result.birthLabel,
      placeLabel: chart.result.placeLabel,
      title: chart.result.analysis.title
    })),
    orders
  })
}
