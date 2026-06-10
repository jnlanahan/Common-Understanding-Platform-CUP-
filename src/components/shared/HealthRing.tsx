export function healthColor(n: number) {
  return n >= 70 ? 'var(--green)' : n >= 45 ? 'var(--amber)' : 'var(--red)'
}

interface Props {
  value: number
  size?: number
}

export function HealthRing({ value, size = 92 }: Props) {
  const r = 38
  const circ = 2 * Math.PI * r
  const color = healthColor(value)
  const fontSize = size < 80 ? 16 : 22

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 92 92">
        <circle cx="46" cy="46" r={r} stroke="var(--panel-2)" strokeWidth="9" fill="none" />
        <circle
          cx="46" cy="46" r={r}
          stroke={color} strokeWidth="9" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - value / 100)}
        />
      </svg>
      <div className="ring-txt" style={{ color, fontSize }}>{value}</div>
    </div>
  )
}
