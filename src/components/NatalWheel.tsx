import { SIGN_ORDER, SIGNS, signColor } from "@/lib/signs"
import type { HouseCusp, Placement } from "@/lib/types"

type NatalWheelProps = {
  rising: Placement
  bodies: Placement[]
  houses: HouseCusp[]
}

const wrap360 = (value: number) => {
  const result = value % 360
  return result < 0 ? result + 360 : result
}

const polar = (horizon: number, radius: number) => {
  const radian = (horizon * Math.PI) / 180
  return {
    x: -radius * Math.cos(radian),
    y: radius * Math.sin(radian)
  }
}

export const NatalWheel = ({ rising, bodies, houses }: NatalWheelProps) => {
  const size = 420
  const center = size / 2
  const outer = 188
  const inner = 62
  const planetRing = 118

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[420px] drop-shadow-[0_0_40px_rgba(228,195,106,0.12)]"
      role="img"
      aria-label={`${rising.signLabel} yükselen natal tekerleği`}
    >
      <circle cx={center} cy={center} r={outer + 8} fill="#0c0e24" stroke="rgba(228,195,106,0.35)" />
      {SIGN_ORDER.map((sign, index) => {
        const start = wrap360(index * 30 - rising.ecliptic)
        const a1 = polar(start, outer)
        const a2 = polar(start + 30, outer)
        const mid = polar(start + 15, outer - 18)
        const color = signColor(sign)
        return (
          <g key={sign}>
            <path
              d={`M ${center} ${center} L ${center + a1.x} ${center + a1.y} A ${outer} ${outer} 0 0 0 ${center + a2.x} ${center + a2.y} Z`}
              fill={color}
              opacity="0.12"
              stroke="rgba(246,241,232,0.08)"
            />
            <text
              x={center + mid.x}
              y={center + mid.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize="14"
            >
              {SIGNS[sign].glyph}
            </text>
          </g>
        )
      })}
      {houses.map((house) => {
        const point = polar(house.horizon, inner + 22)
        const edge = polar(house.horizon, outer)
        return (
          <g key={house.id}>
            <line
              x1={center}
              y1={center}
              x2={center + edge.x}
              y2={center + edge.y}
              stroke="rgba(228,195,106,0.18)"
              strokeWidth={house.id === 1 ? 2.2 : 1}
            />
            <text
              x={center + point.x}
              y={center + point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#b7b0c9"
              fontSize="10"
            >
              {house.id}
            </text>
          </g>
        )
      })}
      <circle cx={center} cy={center} r={inner} fill="#07071a" stroke="rgba(228,195,106,0.4)" />
      <text
        x={center}
        y={center - 6}
        textAnchor="middle"
        fill="#f3e2a7"
        fontSize="13"
        fontFamily="var(--font-cormorant), serif"
      >
        {rising.signGlyph} ASC
      </text>
      <text x={center} y={center + 14} textAnchor="middle" fill="#b7b0c9" fontSize="10">
        {rising.signLabel}
      </text>
      {bodies.map((body, index) => {
        const radius = planetRing + (index % 3) * 10
        const point = polar(body.horizon, radius)
        return (
          <text
            key={body.key}
            x={center + point.x}
            y={center + point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#f6f1e8"
            fontSize="13"
          >
            {body.glyph}
          </text>
        )
      })}
    </svg>
  )
}
