import type { Role } from '../data/types'
import { HealthBadge } from '../components/shared/HealthBadge'
import scenario from '../data/scenario'

interface Props {
  role: Role
}

const STAFF_ROLES: Role[] = ['S3', 'S2', 'S4', 'S6']

export function RunningEstimatesView({ role }: Props) {
  const list = STAFF_ROLES.includes(role)
    ? scenario.estimates.filter(e => e.section.startsWith(role))
    : scenario.estimates
  const display = list.length ? list : scenario.estimates

  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Living Running Estimates</h1>
        <p className="view-desc">
          Each staff section maintains a continuously updated operational estimate. These replace static slides and trackers with a shared, always-current view.
        </p>
      </div>

      <div className="grid grid-3">
        {display.map(e => (
          <div key={e.id} className="card">
            <div className="est-head">
              <span className="est-section">{e.section}</span>
              <HealthBadge health={e.health} />
            </div>
            <div className="est-meta">Owner {e.owner} · updated {e.updated}</div>

            {([
              ['Facts', e.facts],
              ['Assumptions', e.assumptions],
              ['Constraints', e.constraints],
              ['Risks', e.risks],
              ['Opportunities', e.opportunities],
              ['Recommendations', e.recommendations],
              ['Info Gaps', e.gaps],
            ] as [string, string[]][]).filter(([, arr]) => arr?.length).map(([heading, arr]) => (
              <div key={heading} className="est-block">
                <h5>{heading}</h5>
                <ul>{arr.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
