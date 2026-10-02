import { NextResponse } from "next/server"

export const runtime = "nodejs"

type NominatimItem = {
  display_name?: string
  lat?: string
  lon?: string
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() ?? ""

  if (query.length < 2) {
    return NextResponse.json({ places: [] })
  }

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", query)
  url.searchParams.set("format", "json")
  url.searchParams.set("addressdetails", "1")
  url.searchParams.set("limit", "6")
  url.searchParams.set("accept-language", "tr")

  const response = await fetch(url, {
    headers: {
      "User-Agent": "AstroGuidance/1.0 (natal chart app)",
      Accept: "application/json"
    },
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    return NextResponse.json({ error: "Şehir araması şu an yanıt vermiyor" }, { status: 502 })
  }

  const data = (await response.json()) as NominatimItem[]
  const places = data
    .filter((item) => item.lat && item.lon && item.display_name)
    .map((item) => ({
      label: item.display_name as string,
      latitude: Number(item.lat),
      longitude: Number(item.lon)
    }))

  return NextResponse.json({ places })
}
