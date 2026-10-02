"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { BirthForm } from "@/components/BirthForm"
import { ChartResult } from "@/components/ChartResult"
import { ASK_PACK_SIZE } from "@/lib/catalog"
import type { AskTurn, BirthInput, NatalChartResult } from "@/lib/types"

type Draft = {
  chart: NatalChartResult
  chartId: string | null
  birth: BirthInput | null
  unlocked: string[]
  askLimit: number
  asks: AskTurn[]
}

const inheritAskLimit = (draft: Draft | null) => {
  if (!draft) return 0
  if (draft.askLimit > 0) return draft.askLimit
  return draft.unlocked.includes("ask") ? ASK_PACK_SIZE : 0
}

const readDraft = (): Draft | null => {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem("ag_draft")
  if (!raw) return null
  try {
    return JSON.parse(raw) as Draft
  } catch {
    sessionStorage.removeItem("ag_draft")
    return null
  }
}

export const ChartWorkspace = () => {
  const searchParams = useSearchParams()
  const chartIdFromUrl = searchParams.get("id")
  const paymentState = searchParams.get("odeme")
  const [draft] = useState(readDraft)
  const [chart, setChart] = useState<NatalChartResult | null>(draft?.chart ?? null)
  const [chartId, setChartId] = useState<string | null>(draft?.chartId ?? null)
  const [birth, setBirth] = useState<BirthInput | null>(draft?.birth ?? null)
  const [unlocked, setUnlocked] = useState<string[]>(draft?.unlocked ?? [])
  const [askLimit, setAskLimit] = useState(inheritAskLimit(draft))
  const [asks, setAsks] = useState<AskTurn[]>(draft?.asks ?? [])
  const savedId = chartIdFromUrl ?? draft?.chartId
  const [isLoading, setIsLoading] = useState(Boolean(savedId))
  const [error, setError] = useState("")

  useEffect(() => {
    if (!savedId) return

    let cancelled = false
    const load = async () => {
      const response = await fetch(`/api/charts/${savedId}`)
      const data = (await response.json()) as {
        chart?: NatalChartResult
        chartId?: string
        unlocked?: string[]
        askLimit?: number
        asks?: AskTurn[]
        error?: string
      }
      if (cancelled) return
      if (!response.ok || !data.chart) {
        if (chartIdFromUrl) setError(data.error ?? "Kayıtlı harita açılamadı")
        setIsLoading(false)
        return
      }
      setChart(data.chart)
      setChartId(data.chartId ?? savedId)
      setUnlocked(data.unlocked ?? [])
      setAskLimit(
        data.askLimit && data.askLimit > 0
          ? data.askLimit
          : data.unlocked?.includes("ask")
            ? ASK_PACK_SIZE
            : 0
      )
      setAsks(data.asks ?? [])
      setIsLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [savedId, chartIdFromUrl])

  useEffect(() => {
    if (!chart) return
    const next: Draft = { chart, chartId, birth, unlocked, askLimit, asks }
    sessionStorage.setItem("ag_draft", JSON.stringify(next))
  }, [chart, chartId, birth, unlocked, askLimit, asks])

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
      const data = (await response.json()) as {
        chart?: NatalChartResult
        chartId?: string | null
        unlocked?: string[]
        askLimit?: number
        asks?: AskTurn[]
        error?: string
      }
      if (!response.ok || !data.chart) {
        setError(data.error ?? "Harita oluşturulamadı")
        return
      }
      setBirth(input)
      setChart(data.chart)
      setChartId(data.chartId ?? null)
      setUnlocked(data.unlocked ?? [])
      setAskLimit(data.askLimit ?? 0)
      setAsks(data.asks ?? [])
      window.requestAnimationFrame(() => {
        document.getElementById("chart-result")?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    } catch {
      setError("Bağlantı hatası. Biraz sonra yeniden dene.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {paymentState === "ok" && (
        <p className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200" role="status">
          Ödeme alındı. Raporun bu haritada açık.
        </p>
      )}
      {paymentState === "hata" && (
        <p className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">
          Ödeme tamamlanmadı. Kart çekilmediyse tekrar dene. Çekildiyse hesabındaki siparişlere bak.
        </p>
      )}
      <BirthForm isLoading={isLoading} error={error} onSubmit={handleSubmit} />
      {chart && (
        <div id="chart-result">
          <ChartResult
            chart={chart}
            chartId={chartId}
            birth={birth}
            unlocked={unlocked}
            askLimit={askLimit}
            asks={asks}
            onUnlocked={(payload) => {
              setChartId(payload.chartId)
              setUnlocked(payload.unlocked)
              if (payload.askLimit != null) setAskLimit(payload.askLimit)
            }}
            onAsks={setAsks}
          />
        </div>
      )}
    </div>
  )
}
