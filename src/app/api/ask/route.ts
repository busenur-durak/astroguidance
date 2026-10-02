import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { answerAstroQuestion } from "@/lib/ask"
import { remainingAsks } from "@/lib/catalog"
import { addAsk, getChart } from "@/lib/db"

export const runtime = "nodejs"

export const POST = async (request: Request) => {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })
    }
    const body = (await request.json()) as { chartId?: string; question?: string }
    if (!body.chartId || !body.question) {
      return NextResponse.json({ error: "Soru ve harita gerekli" }, { status: 400 })
    }
    const saved = await getChart(body.chartId, user.id)
    if (!saved) {
      return NextResponse.json({ error: "Harita bulunamadı" }, { status: 404 })
    }
    const answer = answerAstroQuestion(saved.result, body.question)
    const chart = await addAsk({
      userId: user.id,
      chartId: body.chartId,
      turn: { question: body.question.trim(), answer }
    })
    return NextResponse.json({
      asks: chart.asks,
      askLimit: chart.askLimit,
      remaining: remainingAsks(chart.askLimit, chart.asks.length)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yanıt üretilemedi"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
