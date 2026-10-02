"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { REPORT_CATALOG } from "@/lib/catalog"
import type { OrderRecord, ReportId } from "@/lib/types"

type ChartRow = {
  id: string
  createdAt: string
  unlocked: string[]
  askLimit: number
  remainingAsks: number
  name: string
  birthLabel: string
  placeLabel: string
  title: string
}

const HesapPage = () => {
  const router = useRouter()
  const { user, isReady, logout } = useAuth()
  const [charts, setCharts] = useState<ChartRow[]>([])
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isReady) return
    if (!user) {
      router.replace("/giris?next=/hesap")
      return
    }
    const load = async () => {
      const response = await fetch("/api/account")
      const data = (await response.json()) as {
        charts?: ChartRow[]
        orders?: OrderRecord[]
        error?: string
      }
      if (!response.ok) {
        setError(data.error ?? "Hesap yüklenemedi")
        return
      }
      setCharts(data.charts ?? [])
      setOrders(data.orders ?? [])
    }
    void load()
  }, [isReady, user, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!isReady || !user) {
    return <p className="px-4 py-12 text-muted">Hesabın açılıyor…</p>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Hesap</p>
          <h1 className="mt-2 font-display text-5xl text-gold-soft">{user.name}</h1>
          <p className="mt-2 text-muted">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink"
        >
          Çıkış yap
        </button>
      </div>
      {error && (
        <p className="mt-4 text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}

      <section className="mt-10">
        <h2 className="font-display text-3xl text-gold-soft">Kayıtlı haritalar</h2>
        {charts.length === 0 ? (
          <p className="mt-3 text-muted">
            Henüz kayıt yok. Girişliyken{" "}
            <Link href="/harita" className="text-gold-soft">
              harita oluştur
            </Link>
            , otomatik kaydedilir.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {charts.map((chart) => (
              <li key={chart.id} className="rounded-3xl border border-line bg-night-soft/80 p-5">
                <h3 className="font-display text-2xl text-gold-soft">{chart.name}</h3>
                <p className="text-sm text-muted">
                  {chart.birthLabel} · {chart.placeLabel}
                </p>
                <p className="mt-2 text-sm">{chart.title}</p>
                <p className="mt-2 text-xs text-muted">
                  Açık raporlar: {chart.unlocked.length ? chart.unlocked.join(", ") : "yalnızca ücretsiz özet"}
                  {chart.askLimit > 0 ? ` · soru hakkı ${chart.remainingAsks}/${chart.askLimit}` : ""}
                </p>
                <Link
                  href={`/harita?id=${chart.id}`}
                  className="mt-4 inline-flex rounded-full bg-gold px-4 py-2 text-sm font-medium text-night"
                >
                  Haritayı aç
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-gold-soft">Siparişler</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-muted">Henüz satın alma yok.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-night/60 px-4 py-3 text-sm"
              >
                <span>
                  {order.id} · {REPORT_CATALOG[order.reportId as ReportId]?.title ?? order.reportId}
                </span>
                <span className="text-gold">
                  {order.amount} TL · {order.status === "paid" ? "ödendi" : order.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default HesapPage
