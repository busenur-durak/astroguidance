"use client"

import { useState } from "react"
import { remainingAsks } from "@/lib/catalog"
import type { AskTurn } from "@/lib/types"

type AskPanelProps = {
  chartId: string | null
  unlocked: boolean
  askLimit: number
  asks: AskTurn[]
  onAsks: (asks: AskTurn[]) => void
  onRequestPack: () => void
}

export const AskPanel = ({ chartId, unlocked, askLimit, asks, onAsks, onRequestPack }: AskPanelProps) => {
  const [question, setQuestion] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const remaining = remainingAsks(askLimit, asks.length)

  if (!unlocked) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!chartId) {
      setError("Soruyu kaydetmek için haritanın hesabında kayıtlı olması gerekir.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartId, question })
      })
      const data = (await response.json()) as { asks?: AskTurn[]; error?: string }
      if (!response.ok || !data.asks) {
        setError(data.error ?? "Yanıt alınamadı")
        return
      }
      onAsks(data.asks)
      setQuestion("")
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyMore = () => {
    onRequestPack()
    window.requestAnimationFrame(() => {
      document.getElementById("report-ask")?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }

  return (
    <section className="rounded-3xl border border-line bg-night-soft/80 p-6">
      <h3 className="font-display text-2xl text-gold-soft">Uzman soru hakkı</h3>
      <p className="mt-1 text-sm text-muted">
        Kalan hak: {remaining} / {askLimit}. Net sor: evlenmeli miyim, işi bırakayım mı, 2041 nasıl geçer.
      </p>
      <ul className="mt-4 space-y-4">
        {asks.map((item, index) => (
          <li key={`${index}-${item.question}`} className="rounded-2xl bg-night/70 p-4">
            <p className="text-sm text-gold-soft">{item.question}</p>
            <p className="mt-2 whitespace-pre-line leading-7 text-ink/90">{item.answer}</p>
          </li>
        ))}
      </ul>
      {remaining > 0 ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="flex flex-col gap-2 text-sm">
            Sorun
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              placeholder="Örn. 2027'de evlenmeli miyim? Bu işi bırakayım mı?"
              className="rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40"
            />
          </label>
          {error && (
            <p className="text-sm text-rose-300" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-gold px-5 py-2 font-medium text-night disabled:opacity-60"
            >
              {isLoading ? "Yanıtlanıyor…" : "Sor"}
            </button>
            <button
              type="button"
              onClick={handleBuyMore}
              className="rounded-full border border-line px-5 py-2 text-sm text-muted hover:text-ink"
            >
              3 soru daha ekle
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted">Hakların doldu. Eski sorular durur. Yeni paket +3 hak ekler.</p>
          <button
            type="button"
            onClick={handleBuyMore}
            className="rounded-full bg-gold px-5 py-2 font-medium text-night"
          >
            3 soru hakkı al
          </button>
        </div>
      )}
    </section>
  )
}
