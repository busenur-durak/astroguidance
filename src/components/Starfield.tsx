const stars = Array.from({ length: 90 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  size: (index % 3) + 1,
  delay: `${(index % 8) * 0.35}s`,
  opacity: 0.25 + (index % 5) * 0.12
}))

export const Starfield = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 top-[-8rem] h-80 w-80 rounded-full bg-violet-700/20 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      {stars.map((star) => (
        <span
          key={`${star.left}-${star.top}`}
          className="absolute rounded-full bg-gold-soft"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `pulse 4.5s ease-in-out ${star.delay} infinite`
          }}
        />
      ))}
    </div>
  )
}
