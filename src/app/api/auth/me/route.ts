import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

export const runtime = "nodejs"

export const GET = async () => {
  const user = await getSessionUser()
  return NextResponse.json({ user })
}
