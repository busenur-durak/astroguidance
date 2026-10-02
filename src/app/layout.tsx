import type { Metadata } from "next"
import { Cormorant_Garamond, Outfit } from "next/font/google"
import { AuthProvider } from "@/components/AuthProvider"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { Starfield } from "@/components/Starfield"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  display: "swap"
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap"
})

export const metadata: Metadata = {
  title: {
    default: "AstroGuidance — Natal okuma atölyesi",
    template: "%s · AstroGuidance"
  },
  description:
    "Doğum anına bağlı natal harita. İlişki, meslek ve dönemsel takvim raporları — tropikal zodyak, Placidus evler."
}

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="tr" className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="relative min-h-full bg-night font-sans text-ink">
        <Starfield />
        <AuthProvider>
          <div className="relative z-10 flex min-h-full flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
