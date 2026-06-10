import type { DrawerContent, Role, ViewId } from '../data/types'
import { HealthRing, healthColor } from '../components/shared/HealthRing'
import scenario from '../data/scenario'

interface Props {
  role: Role
  onOpenDrawer: (content: DrawerContent) => void
  onNavigate: (view: ViewId) => void
}

export function DashboardView({ onOpenDrawer, onNavigate }: Props) {
  const { operation: op, changeFeed, assumptions, conflicts, decisions, summaries } = scenario

  const decRequired = decisions.filter(d => d.status === 'Decision Required').length
  const atRisk = assumptions.filter(a => a.status === 'At Risk' || a.status === 'Failing').length
  const openConflicts = conflicts.filter(c => c.status !== 'Resolved').length
  const critCount = changeFeed.filter(c => c.severity === 'critical').length
  const warnCount = changeFeed.filter(c => c.severity === 'warning').length

  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Commander Dashboard</h1>
        <p className="view-desc">
          What changed, why it matters, and what decisions are required — synthesized from every staff section's living estimate.
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="card">
          <p className="card-title">Plan Health Index</p>
          <div className="ring-wrap">
            <HealthRing value={op.overallHealth} />
            <div>
              <div className="stat-label">Aggregate across<br />{scenario.plans.length} active plans</div>
              <div className="stat-sub" style={{ marginTop: 6 }}>Posture: {op.posture}</div>
            </div>
          </div>
        </div>

        <div className="card stat" style={{ cursor: 'pointer' }} onClick={() => onNavigate('decisions')}>
          <div className="stat-val" style={{ color: 'var(--critical)' }}>{decRequired}</div>
          <div className="stat-label">Decisions required now</div>
          <div className="stat-sub">Commander action</div>
        </div>

        <div className="card stat" style={{ cursor: 'pointer' }} onClick={() => onNavigate('assumptions')}>
          <div className="stat-val" style={{ color: 'var(--amber)' }}>{atRisk}</div>
          <div className="stat-label">Assumptions failing / at risk</div>
          <div className="stat-sub">of {assumptions.length} tracked</div>
        </div>

        <div className="card stat" style={{ cursor: 'pointer' }} onClick={() => onNavigate('conflicts')}>
          <div className="stat-val" style={{ color: 'var(--red)' }}>{openConflicts}</div>
          <div className="stat-label">Open cross-staff conflicts</div>
          <div className="stat-sub">{critCount} critical, {warnCount} warnings in feed</div>
        </div>
      </div>

      {/* Commander summary + decisions */}
      <div className="grid grid-2">
        <div className="card">
          <p className="card-title">Commander Update — auto-generated</p>
          <ul className="sum-list">
            {summaries.commander.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="card">
          <p className="card-title">Decisions approaching</p>
          {decisions.map(d => {
            const cls = d.status === 'Decision Required' ? 'req' : d.status === 'Approaching' ? 'appr' : ''
            const badgeCls = d.status === 'Decision Required' ? 'b-critical' : d.status === 'Approaching' ? 'b-warning' : 'b-info'
            return (
              <div
                key={d.id}
                className={`card dec-card ${cls}`}
                style={{ marginBottom: 10, cursor: 'pointer', background: 'var(--panel-2)' }}
                onClick={() => onOpenDrawer({ type: 'decision', item: d })}
              >
                <div className="row-between">
                  <strong style={{ fontSize: 13.5 }}>{d.name}</strong>
                  <span className={`badge ${badgeCls}`}>{d.status}</span>
                </div>
                <div className="kv">ETA <b>{d.eta}</b> · Owner <b>{d.owner}</b></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent changes */}
      <div className="section-spacer" />
      <div className="row-between" style={{ marginBottom: 10 }}>
        <p className="card-title" style={{ margin: 0 }}>Latest changes</p>
        <span className="chip-link" onClick={() => onNavigate('changes')}>See full feed →</span>
      </div>
      {changeFeed.slice(0, 3).map(c => (
        <div
          key={c.id}
          className="feed-item"
          onClick={() => onOpenDrawer({ type: 'change', item: c })}
        >
          <div className={`feed-rail r-${c.severity}`} />
          <div className="feed-main">
            <div className="feed-top">
              <span className="feed-time">{c.time}</span>
              <span className={`badge b-${c.severity}`}>{c.severity}</span>
              <span className="feed-title">{c.title}</span>
            </div>
            <div className="feed-line"><b>What changed:</b> {c.whatChanged}</div>
            <div className="feed-line"><b>Why it matters:</b> {c.whyItMatters}</div>
            <div className="who-tags">
              {c.whoCares.map(w => <span key={w} className="who-tag">{w}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
