import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export const runtime = "nodejs"

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string }
    const user = await registerUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? ""
    })
    return NextResponse.json({ user })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt tamamlanamadı"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
