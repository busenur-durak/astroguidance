import { compare, hash } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { createUser, findUserByEmail, findUserById, publicUser } from "@/lib/db"
import type { PublicUser } from "@/lib/types"

const COOKIE = "ag_session"
const fallbackSecret = "astroguidance-local-dev-secret-change-me"
if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
  throw new Error("Canlıda AUTH_SECRET zorunlu")
}
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? fallbackSecret)

const tokenFor = async (userId: string) =>
  new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret)

export const hashPassword = (password: string) => hash(password, 10)

export const setSession = async (userId: string) => {
  const token = await tokenFor(userId)
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  })
}

export const clearSession = async () => {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export const getSessionUser = async (): Promise<PublicUser | null> => {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    if (!payload.sub) return null
    const user = await findUserById(payload.sub)
    return user ? publicUser(user) : null
  } catch {
    return null
  }
}

export const registerUser = async (input: { name: string; email: string; password: string }) => {
  const name = input.name.trim()
  const email = input.email.trim()
  const password = input.password
  if (name.length < 2) throw new Error("Ad en az 2 karakter olmalı")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Geçerli bir e-posta yaz")
  if (password.length < 6) throw new Error("Şifre en az 6 karakter olmalı")
  const user = await createUser({
    name,
    email,
    passwordHash: await hashPassword(password)
  })
  await setSession(user.id)
  return publicUser(user)
}

export const loginUser = async (input: { email: string; password: string }) => {
  const user = await findUserByEmail(input.email.trim())
  if (!user) throw new Error("E-posta veya şifre hatalı")
  const ok = await compare(input.password, user.passwordHash)
  if (!ok) throw new Error("E-posta veya şifre hatalı")
  await setSession(user.id)
  return publicUser(user)
}
