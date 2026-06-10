import type { Severity } from '../../data/types'

const cls: Record<Severity, string> = {
  critical: 'b-critical',
  warning: 'b-warning',
  info: 'b-info',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`badge ${cls[severity]}`}>{severity}</span>
}
