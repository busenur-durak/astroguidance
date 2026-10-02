"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

type AuthFormProps = {
  mode: "login" | "register"
  nextPath?: string
}

export const AuthForm = ({ mode, nextPath = "/hesap" }: AuthFormProps) => {
  const router = useRouter()
  const { refresh } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register" ? { name, email, password } : { email, password }
        )
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(data.error ?? "İşlem tamamlanamadı")
        return
      }
      await refresh()
      router.push(nextPath)
      router.refresh()
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-line bg-night-soft/80 p-6">
      {mode === "register" && (
        <label className="mb-4 flex flex-col gap-2 text-sm">
          Adın
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            name="name"
            autoComplete="name"
            className="rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40"
          />
        </label>
      )}
      <label className="mb-4 flex flex-col gap-2 text-sm">
        E-posta
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          name="email"
          autoComplete="email"
          required
          className="rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40"
        />
      </label>
      <label className="mb-4 flex flex-col gap-2 text-sm">
        Şifre
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          name="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          required
          minLength={6}
          className="rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40"
        />
      </label>
      {error && (
        <p className="mb-4 text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-gold py-3 font-medium text-night disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-gold"
      >
        {isLoading ? "Gönderiliyor…" : mode === "register" ? "Hesap oluştur" : "Giriş yap"}
      </button>
    </form>
  )
}
