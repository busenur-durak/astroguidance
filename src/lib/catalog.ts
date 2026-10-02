import type { ReportId } from "@/lib/types"

export type ProductKind = "unlock" | "pack"

export const ASK_PACK_SIZE = 3

export const REPORT_CATALOG: Record<
  ReportId,
  {
    title: string
    amount: number
    priceLabel: string
    summary: string
    kind: ProductKind
    packSize?: number
  }
> = {
  love: {
    title: "Kişisel İlişki & Aşk Raporu",
    amount: 69,
    priceLabel: "69 TL",
    summary: "İhtiyaç, duygular, uyumlu burçlar ve net yönlendirme",
    kind: "unlock"
  },
  career: {
    title: "Kariyer, Para & Yaşam Amacı",
    amount: 69,
    priceLabel: "69 TL",
    summary: "Meslek, ortam, para dili ve somut adımlar",
    kind: "unlock"
  },
  timing: {
    title: "Tarih Pencereleri",
    amount: 99,
    priceLabel: "99 TL",
    summary: "Aşk–evlilik ve kariyer için en iyi / en kötü tarihler · tüm hayat",
    kind: "unlock"
  },
  ask: {
    title: "Uzman Soru Hakkı",
    amount: 39,
    priceLabel: "39 TL",
    summary: "3 soru paketi · haklar birikir, tekrar alınır",
    kind: "pack",
    packSize: ASK_PACK_SIZE
  }
}

export const isReportId = (value: string): value is ReportId =>
  value === "love" || value === "career" || value === "timing" || value === "ask"

export const isPackProduct = (reportId: ReportId) => REPORT_CATALOG[reportId].kind === "pack"

export const remainingAsks = (askLimit: number, used: number) => Math.max(0, askLimit - used)
