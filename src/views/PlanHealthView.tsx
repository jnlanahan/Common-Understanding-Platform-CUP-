import { HealthRing, healthColor } from '../components/shared/HealthRing'
import scenario from '../data/scenario'

export function PlanHealthView() {
  const riskColor = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--green)' }

  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Plan Health Monitoring</h1>
        <p className="view-desc">
          Plans receive dynamic health assessments — feasibility, supportability, synchronization, and risk — recomputed as conditions and assumptions change.
        </p>
      </div>

      <div className="grid grid-3">
        {scenario.plans.map(p => (
          <div key={p.id} className="card">
            <div className="row-between" style={{ marginBottom: 4 }}>
              <strong style={{ fontSize: 14.5 }}>{p.name}</strong>
            </div>
            <div className="est-meta">
              {p.phase} · Risk: <b style={{ color: riskColor[p.risk] }}>{p.risk}</b>
            </div>

            <div className="ring-wrap" style={{ margin: '10px 0 14px' }}>
              <HealthRing value={p.health} size={64} />
              <div className="stat-label">Overall<br />health</div>
            </div>

            {([
              ['Feasibility', p.feasibility],
              ['Supportability', p.supportability],
              ['Synchronization', p.synchronization],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="bar-row">
                <span className="lbl">{label}</span>
                <span className="bar">
                  <span style={{ width: `${val}%`, background: healthColor(val) }} />
                </span>
                <span className="bar-val">{val}</span>
              </div>
            ))}

            <p className="hint" style={{ marginTop: 10 }}>{p.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
