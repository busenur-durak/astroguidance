import { NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export const runtime = "nodejs"

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const user = await loginUser({
      email: body.email ?? "",
      password: body.password ?? ""
    })
    return NextResponse.json({ user })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Giriş yapılamadı"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
