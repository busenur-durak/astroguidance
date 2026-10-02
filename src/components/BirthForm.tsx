"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Search } from "lucide-react"
import { cn } from "@/lib/cn"
import type { BirthInput, GeoPlace } from "@/lib/types"

type BirthFormProps = {
  isLoading: boolean
  error: string
  onSubmit: (input: BirthInput) => void
}

const DEMO: BirthInput = {
  name: "Deniz Yıldız",
  date: "1992-03-21",
  time: "14:20",
  place: {
    label: "İstanbul, Türkiye",
    latitude: 41.0082,
    longitude: 28.9784
  }
}

export const BirthForm = ({ isLoading, error, onSubmit }: BirthFormProps) => {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [query, setQuery] = useState("")
  const [place, setPlace] = useState<GeoPlace | null>(null)
  const [suggestions, setSuggestions] = useState<GeoPlace[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [formError, setFormError] = useState("")
  const listRef = useRef<HTMLUListElement>(null)

  const canSearch = query.trim().length >= 2 && !(place && query === place.label)
  const shownSuggestions = canSearch ? suggestions : []

  useEffect(() => {
    if (!canSearch) return

    const handle = window.setTimeout(async () => {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`)
      const data = (await response.json()) as { places?: GeoPlace[] }
      setSuggestions(data.places ?? [])
      setActiveIndex(-1)
    }, 350)

    return () => window.clearTimeout(handle)
  }, [canSearch, query])

  const handleSelectPlace = (selected: GeoPlace) => {
    setPlace(selected)
    setQuery(selected.label)
    setSuggestions([])
  }

  const handleDemo = () => {
    setName(DEMO.name)
    setDate(DEMO.date)
    setTime(DEMO.time)
    setPlace(DEMO.place)
    setQuery(DEMO.place.label)
    setFormError("")
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim().length < 2) {
      setFormError("Lütfen adını yaz.")
      return
    }
    if (!date || !time) {
      setFormError("Doğum tarihi ve saati gerekli. Saat bilinmiyorsa öğlen 12:00 deneyebilirsin.")
      return
    }
    if (!place) {
      setFormError("Listeden bir doğum yeri seç.")
      return
    }
    setFormError("")
    onSubmit({ name: name.trim(), date, time, place })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((value) => Math.min(value + 1, shownSuggestions.length - 1))
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((value) => Math.max(value - 1, 0))
    }
    if (event.key === "Enter" && activeIndex >= 0 && shownSuggestions[activeIndex]) {
      event.preventDefault()
      handleSelectPlace(shownSuggestions[activeIndex])
    }
    if (event.key === "Escape") {
      setSuggestions([])
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-night-soft/80 p-6 shadow-[0_0_80px_rgba(124,108,240,0.08)] backdrop-blur"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Adım 1 — Veri</p>
          <h2 className="font-display text-3xl text-gold-soft">Doğum bilgilerin</h2>
        </div>
        <button
          type="button"
          onClick={handleDemo}
          className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-gold hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          Örnek harita ile dene
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span>Adın</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            name="name"
            autoComplete="name"
            placeholder="Adın veya bir rumuz"
            className="rounded-2xl border border-line bg-night px-4 py-3 text-ink outline-none ring-gold/40 placeholder:text-muted/70 focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Doğum tarihi</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            name="date"
            required
            className="rounded-2xl border border-line bg-night px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-gold/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Doğum saati</span>
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            name="time"
            required
            className="rounded-2xl border border-line bg-night px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-gold/40"
          />
        </label>

        <div className="relative sm:col-span-2">
          <label className="flex flex-col gap-2 text-sm">
            <span>Doğum yeri</span>
            <span className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPlace(null)
                }}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={shownSuggestions.length > 0}
                aria-controls="place-list"
                placeholder="Şehir veya ilçe ara"
                className="w-full rounded-2xl border border-line bg-night py-3 pl-10 pr-4 text-ink outline-none focus:ring-2 focus:ring-gold/40"
              />
            </span>
          </label>
          {shownSuggestions.length > 0 && (
            <ul
              id="place-list"
              ref={listRef}
              role="listbox"
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-night-soft shadow-xl"
            >
              {shownSuggestions.map((item, index) => (
                <li key={`${item.label}-${item.latitude}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onClick={() => handleSelectPlace(item)}
                    className={cn(
                      "flex w-full items-start gap-2 px-4 py-3 text-left text-sm hover:bg-white/5",
                      index === activeIndex && "bg-white/5"
                    )}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(formError || error) && (
        <p className="mt-4 text-sm text-rose-300" role="alert">
          {formError || error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-full bg-gold px-6 py-3 font-medium text-night transition hover:bg-gold-soft disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {isLoading ? "Harita hesaplanıyor…" : "Natal haritamı çıkar"}
      </button>
    </form>
  )
}
