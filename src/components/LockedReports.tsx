"use client"

import { useState } from "react"
import Link from "next/link"
import { Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/cn"
import { useAuth } from "@/components/AuthProvider"
import { ReportSections } from "@/components/ReportSections"
import { ASK_PACK_SIZE, REPORT_CATALOG, remainingAsks } from "@/lib/catalog"
import type { BirthInput, LockedReport, ReportId } from "@/lib/types"

type LockedReportsProps = {
  reports: LockedReport[]
  unlocked: string[]
  askLimit: number
  usedAsks: number
  chartId: string | null
  birth: BirthInput | null
  checkoutId: ReportId | null
  onCheckoutId: (id: ReportId | null) => void
  onUnlocked: (payload: { chartId: string; unlocked: string[]; askLimit?: number }) => void
}

export const LockedReports = ({
  reports,
  unlocked,
  askLimit,
  usedAsks,
  chartId,
  birth,
  checkoutId,
  onCheckoutId,
  onUnlocked
}: LockedReportsProps) => {
  const { user } = useAuth()
  const [payerName, setPayerName] = useState(user?.name ?? "")
  const [payerEmail, setPayerEmail] = useState(user?.email ?? "")
  const [payerPhone, setPayerPhone] = useState("")
  const [identityNumber, setIdentityNumber] = useState("")
  const [error, setError] = useState("")
  const [isPaying, setIsPaying] = useState(false)
  const [provider, setProvider] = useState<"iyzico" | "mock" | "blocked">("mock")
  const askLeft = remainingAsks(askLimit, usedAsks)
  const selected = reports.find((item) => item.id === checkoutId) ?? null

  const handleOpen = (report: LockedReport) => {
    setPayerName(user?.name ?? "")
    setPayerEmail(user?.email ?? "")
    setError("")
    onCheckoutId(report.id)
    void fetch("/api/orders")
      .then((response) => response.json())
      .then((data: { provider?: "iyzico" | "mock" | "blocked" }) => {
        if (data.provider) setProvider(data.provider)
      })
  }

  const handlePurchase = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected) return
    setIsPaying(true)
    setError("")
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartId,
          reportId: selected.id as ReportId,
          payerName,
          payerEmail,
          payerPhone,
          identityNumber,
          birth
        })
      })
      const data = (await response.json()) as {
        error?: string
        chartId?: string
        unlocked?: string[]
        askLimit?: number
        paymentUrl?: string
        mode?: string
      }
      if (!response.ok) {
        setError(data.error ?? "Ödeme tamamlanamadı")
        return
      }
      if (data.paymentUrl) {
        window.location.assign(data.paymentUrl)
        return
      }
      if (data.chartId && data.unlocked) {
        onUnlocked({ chartId: data.chartId, unlocked: data.unlocked, askLimit: data.askLimit })
      }
      onCheckoutId(null)
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <section className="mt-10">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Uzman raporlar</p>
      <h2 className="font-display text-3xl text-gold-soft">Derin okumalar</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Aşk, kariyer ve tarih bu haritada bir kez alınır, açık kalır. Soru hakkı pakettir: her
        alışveriş {ASK_PACK_SIZE} soru ekler, haklar birikir.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const meta = REPORT_CATALOG[report.id]
          const isPack = meta.kind === "pack"
          const isOpen = unlocked.includes(report.id)
          const canBuy = !isOpen || isPack
          return (
            <article
              id={`report-${report.id}`}
              key={report.id}
              className={cn(
                "rounded-3xl border border-line bg-night-soft/80 p-5",
                isOpen && !isPack && "md:col-span-2"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-gold-soft">{report.title}</h3>
                  <p className="text-sm text-muted">{report.priceNote}</p>
                </div>
                <span className="rounded-full border border-gold/40 px-3 py-1 text-sm text-gold">{report.price}</span>
              </div>
              {isOpen ? (
                <div className="mt-5 space-y-4">
                  <p className="flex items-center gap-2 text-sm text-emerald-300">
                    <Unlock className="h-4 w-4" aria-hidden="true" />
                    {isPack
                      ? `Paket açık · kalan ${askLeft} / ${askLimit} hak`
                      : "Bu haritada açık · yeniden alınmaz"}
                  </p>
                  {report.sections?.length ? (
                    <ReportSections sections={report.sections} />
                  ) : (
                    <p className="leading-7 text-ink/90">{report.body}</p>
                  )}
                  {isPack && (
                    <button
                      type="button"
                      onClick={() => handleOpen(report)}
                      className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-night focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    >
                      {askLeft > 0 ? `${ASK_PACK_SIZE} soru daha ekle` : `${ASK_PACK_SIZE} soru hakkı al`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative mt-4 overflow-hidden rounded-2xl">
                  <p className="leading-7 text-ink/80 blur-[2.5px]">{report.preview}</p>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night/55">
                    <Lock className="h-5 w-5 text-gold" aria-hidden="true" />
                    {canBuy && (
                      <button
                        type="button"
                        onClick={() => handleOpen(report)}
                        className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-night focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                      >
                        {isPack ? `${ASK_PACK_SIZE} soru hakkı al` : "Raporu aç"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-line bg-night-soft p-6">
            <h3 id="checkout-title" className="font-display text-3xl text-gold-soft">
              {selected.title}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {REPORT_CATALOG[selected.id].kind === "pack"
                ? `Mevcut hakların durur. +${ASK_PACK_SIZE} soru eklenir.`
                : "Bu haritada bir kez açılır, sonra yeniden ödenmez."}
            </p>
            <p className="mt-4 font-display text-4xl text-gold">{selected.price}</p>
            {!user ? (
              <div className="mt-5 space-y-3">
                <p className="text-muted">Satın alma ve geçmiş için önce hesabına gir.</p>
                <Link
                  href={`/giris?next=${encodeURIComponent("/harita")}`}
                  className="inline-flex rounded-full bg-gold px-5 py-2.5 font-medium text-night"
                >
                  Giriş yap
                </Link>
                <button
                  type="button"
                  onClick={() => onCheckoutId(null)}
                  className="ml-3 rounded-full border border-line px-5 py-2.5 text-muted"
                >
                  Vazgeç
                </button>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="mt-4 space-y-3">
                <label className="flex flex-col gap-1 text-sm">
                  Fatura adı
                  <input
                    value={payerName}
                    onChange={(event) => setPayerName(event.target.value)}
                    required
                    className="rounded-2xl border border-line bg-night px-3 py-2 outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  E-posta
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(event) => setPayerEmail(event.target.value)}
                    required
                    className="rounded-2xl border border-line bg-night px-3 py-2 outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Telefon
                  <input
                    value={payerPhone}
                    onChange={(event) => setPayerPhone(event.target.value)}
                    placeholder="05xx xxx xx xx"
                    required
                    className="rounded-2xl border border-line bg-night px-3 py-2 outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </label>
                {provider === "iyzico" && (
                  <label className="flex flex-col gap-1 text-sm">
                    TC kimlik no
                    <input
                      value={identityNumber}
                      onChange={(event) => setIdentityNumber(event.target.value.replace(/\D/g, "").slice(0, 11))}
                      inputMode="numeric"
                      minLength={11}
                      maxLength={11}
                      required
                      placeholder="Ödeme doğrulaması için"
                      className="rounded-2xl border border-line bg-night px-3 py-2 outline-none focus:ring-2 focus:ring-gold/40"
                    />
                  </label>
                )}
                {provider === "blocked" && (
                  <p className="text-sm text-rose-300" role="alert">
                    Canlı ödeme anahtarları eksik. Kart çekimi şu an kapalı.
                  </p>
                )}
                {error && (
                  <p className="text-sm text-rose-300" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isPaying}
                    className={cn(
                      "rounded-full bg-gold px-5 py-2.5 font-medium text-night disabled:opacity-60",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    )}
                  >
                    {isPaying ? "İşleniyor…" : provider === "iyzico" ? "Kartla güvenli öde" : "Ödemeyi tamamla"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onCheckoutId(null)}
                    className="rounded-full border border-line px-5 py-2.5 text-muted hover:text-ink"
                  >
                    Vazgeç
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
