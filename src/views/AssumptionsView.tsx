import type { DrawerContent } from '../data/types'
import { healthColor } from '../components/shared/HealthRing'
import scenario from '../data/scenario'

interface Props {
  onOpenDrawer: (content: DrawerContent) => void
}

const statusCls: Record<string, string> = {
  Valid: 'b-green',
  Failing: 'b-critical',
  'At Risk': 'b-warning',
  Unconfirmed: 'b-info',
}

export function AssumptionsView({ onOpenDrawer }: Props) {
  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Assumption Management</h1>
        <p className="view-desc">
          Plans are hypotheses. Every operational assumption is tracked with its owner, confidence, and live validity as supporting and contradicting evidence accumulates.
        </p>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Assumption</th>
              <th>Owner</th>
              <th>Confidence</th>
              <th>Status</th>
              <th style={{ width: 160 }}>Validity</th>
            </tr>
          </thead>
          <tbody>
            {scenario.assumptions.map(a => (
              <tr
                key={a.id}
                className="clickable"
                onClick={() => onOpenDrawer({ type: 'assumption', item: a })}
              >
                <td><b>{a.id.toUpperCase()}</b> — {a.text}</td>
                <td>{a.owner}</td>
                <td>{a.confidence}</td>
                <td>
                  <span className={`badge ${statusCls[a.status] ?? 'b-info'}`}>{a.status}</span>
                </td>
                <td>
                  <div className="meter">
                    <span style={{ width: `${a.validity}%`, background: healthColor(a.validity) }} />
                  </div>
                  <span className="muted" style={{ fontSize: 11 }}>{a.validity}% confidence in validity</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
