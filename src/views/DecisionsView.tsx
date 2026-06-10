import type { DrawerContent } from '../data/types'
import scenario from '../data/scenario'

interface Props {
  onOpenDrawer: (content: DrawerContent) => void
}

export function DecisionsView({ onOpenDrawer }: Props) {
  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Decision Support</h1>
        <p className="view-desc">
          The system surfaces decisions that are approaching, decisions affected by changing conditions, and the information required before each one. It informs — it never decides.
        </p>
      </div>

      <div className="grid grid-3">
        {scenario.decisions.map(d => {
          const cls = d.status === 'Decision Required' ? 'req' : d.status === 'Approaching' ? 'appr' : ''
          const badgeCls = d.status === 'Decision Required' ? 'b-critical' : d.status === 'Approaching' ? 'b-warning' : 'b-info'

          return (
            <div
              key={d.id}
              className={`card dec-card ${cls}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenDrawer({ type: 'decision', item: d })}
            >
              <div className="row-between" style={{ marginBottom: 6 }}>
                <strong style={{ fontSize: 14 }}>{d.name}</strong>
              </div>
              <span className={`badge ${badgeCls}`}>{d.status}</span>
              <div className="kv" style={{ marginTop: 10 }}>ETA <b>{d.eta}</b></div>
              <div className="kv">Owner <b>{d.owner}</b></div>
              <h5 style={{ margin: '12px 0 2px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-faint)' }}>
                Affected by
              </h5>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {d.affectedBy.map((x, i) => (
                  <li key={i} style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{x}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
