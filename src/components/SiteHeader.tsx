"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

const links = [
  { href: "/harita", label: "Harita" },
  { href: "/raporlar", label: "Raporlar" },
  { href: "/hakkimizda", label: "Yöntem" }
]

export const SiteHeader = () => {
  const { user, isReady } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          aria-label="AstroGuidance ana sayfa"
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          <span className="font-display text-2xl tracking-wide">AstroGuidance</span>
        </Link>
        <nav aria-label="Ana menü" className="flex flex-wrap items-center justify-end gap-1 sm:gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-2 text-xs text-muted transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:px-3 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
          {isReady && user ? (
            <Link
              href="/hesap"
              className="rounded-full border border-gold/40 px-3 py-2 text-xs text-gold-soft sm:text-sm focus-visible:outline-2 focus-visible:outline-gold"
            >
              Hesabım
            </Link>
          ) : (
            <Link
              href="/giris"
              className="rounded-full bg-gold px-3 py-2 text-xs font-medium text-night sm:text-sm focus-visible:outline-2 focus-visible:outline-gold"
            >
              Giriş
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
