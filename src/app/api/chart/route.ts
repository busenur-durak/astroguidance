import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { calculateNatalChart } from "@/lib/chart"
import { saveChart } from "@/lib/db"
import type { BirthInput } from "@/lib/types"

export const runtime = "nodejs"

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as Partial<BirthInput>
    const name = body.name?.trim()
    const date = body.date
    const time = body.time
    const place = body.place

    if (!name || !date || !time || !place?.label) {
      return NextResponse.json(
        { error: "Ad, doğum tarihi, saat ve yer zorunludur" },
        { status: 400 }
      )
    }

    const chart = calculateNatalChart({
      name,
      date,
      time,
      place: {
        label: place.label,
        latitude: Number(place.latitude),
        longitude: Number(place.longitude)
      }
    })

    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ chart, chartId: null, unlocked: [] as string[], askLimit: 0 })
    }

    const saved = await saveChart({ userId: user.id, result: chart })
    return NextResponse.json({
      chart: saved.result,
      chartId: saved.id,
      unlocked: saved.unlocked,
      askLimit: saved.askLimit,
      asks: saved.asks
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Harita hesaplanamadı"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
