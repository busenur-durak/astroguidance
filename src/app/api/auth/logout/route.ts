import { NextResponse } from "next/server"
import { clearSession } from "@/lib/auth"

export const runtime = "nodejs"

export const POST = async () => {
  await clearSession()
  return NextResponse.json({ ok: true })
}
