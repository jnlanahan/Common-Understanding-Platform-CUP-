import type { Health } from '../../data/types'

const badgeCls: Record<Health, string> = { green: 'b-green', amber: 'b-amber', red: 'b-red' }
const dotCls: Record<Health, string> = { green: 'd-green', amber: 'd-amber', red: 'd-red' }

export function HealthBadge({ health }: { health: Health }) {
  return (
    <span className={`badge ${badgeCls[health]}`}>
      <span className={`dot ${dotCls[health]}`} />
      {health}
    </span>
  )
}
