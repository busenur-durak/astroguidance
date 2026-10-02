import { toPng } from "html-to-image"
import jsPDF from "jspdf"

const downloadBlob = (href: string, filename: string) => {
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.click()
}

const fileSlug = (name: string) => name.replace(/\s+/g, "-").toLowerCase()

export const downloadSharePng = async (chartName: string) => {
  const node = document.getElementById("share-card")
  if (!node) throw new Error("Paylaşım kartı bulunamadı")
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true })
  downloadBlob(dataUrl, `${fileSlug(chartName)}-astroguidance.png`)
}

export const downloadReportPdf = async (chartName: string) => {
  const node = document.getElementById("pdf-report")
  if (!node) throw new Error("Rapor yüzeyi bulunamadı")
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true })
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const image = new Image()
  image.src = dataUrl
  await image.decode()
  const ratio = pageWidth / image.width
  const renderHeight = image.height * ratio
  let remaining = renderHeight
  let offset = 0
  pdf.addImage(dataUrl, "PNG", 0, offset, pageWidth, renderHeight)
  remaining -= pageHeight
  while (remaining > 0) {
    offset -= pageHeight
    pdf.addPage()
    pdf.addImage(dataUrl, "PNG", 0, offset, pageWidth, renderHeight)
    remaining -= pageHeight
  }
  pdf.save(`${fileSlug(chartName)}-astroguidance.pdf`)
}
