"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { PublicUser } from "@/lib/types"

type AuthContextValue = {
  user: PublicUser | null
  isReady: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isReady: false,
  refresh: async () => undefined,
  logout: async () => undefined
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  const refresh = async () => {
    const response = await fetch("/api/auth/me")
    const data = (await response.json()) as { user?: PublicUser | null }
    setUser(data.user ?? null)
    setIsReady(true)
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const response = await fetch("/api/auth/me")
      const data = (await response.json()) as { user?: PublicUser | null }
      if (cancelled) return
      setUser(data.user ?? null)
      setIsReady(true)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isReady, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
