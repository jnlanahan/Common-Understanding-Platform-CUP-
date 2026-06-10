import type { DrawerContent } from '../data/types'
import { SeverityBadge } from '../components/shared/SeverityBadge'
import scenario from '../data/scenario'

interface Props {
  onOpenDrawer: (content: DrawerContent) => void
}

const statusCls: Record<string, string> = {
  Open: 'b-red',
  Mitigating: 'b-amber',
  Resolved: 'b-green',
}

export function ConflictsView({ onOpenDrawer }: Props) {
  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Cross-Staff Conflict Detection</h1>
        <p className="view-desc">
          The platform flags where staff assessments are inconsistent — for example, when operations exceeds sustainment capability, or comms coverage does not support maneuver.
        </p>
      </div>

      {scenario.conflicts.map(c => (
        <div
          key={c.id}
          className="card"
          style={{ marginBottom: 14, cursor: 'pointer' }}
          onClick={() => onOpenDrawer({ type: 'conflict', item: c })}
        >
          <div className="feed-top">
            <SeverityBadge severity={c.severity} />
            <span className="feed-title">{c.title}</span>
            <span className="pill-counter">{c.sections.join(' ⇄ ')}</span>
            <span className={`badge ${statusCls[c.status] ?? 'b-info'}`} style={{ marginLeft: 'auto' }}>
              {c.status}
            </span>
          </div>
          <div className="feed-line" style={{ marginTop: 8 }}>{c.summary}</div>
          <div className="feed-line"><b>Recommendation:</b> {c.recommendation}</div>
        </div>
      ))}
    </div>
  )
}
