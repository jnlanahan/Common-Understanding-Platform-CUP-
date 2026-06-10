import type { Operation, Role } from '../../data/types'

interface Props {
  operation: Operation
  role: Role
  onRoleChange: (role: Role) => void
}

const roles: Role[] = ['Commander', 'S3', 'S2', 'S4', 'S6', 'Staff Primary']
const roleLabels: Record<Role, string> = {
  Commander: 'Commander',
  S3: 'S3 — Ops',
  S2: 'S2 — Intel',
  S4: 'S4 — Sustain',
  S6: 'S6 — Signal',
  'Staff Primary': 'Staff Primary',
}

export function TopBar({ operation: op, role, onRoleChange }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">CUP</div>
        <div>
          <div className="brand-title">Common Understanding Platform</div>
          <div className="brand-sub">Operational Context Management</div>
        </div>
      </div>

      <div className="op-banner">
        <strong>{op.unit}</strong> — {op.name} ·{' '}
        <strong>{op.phase}</strong> · DTG {op.dtg} · CDR {op.commander}
      </div>

      <div className="topbar-right">
        <div className="classification">{op.classification}</div>
        <div className="role-switch">
          <label htmlFor="roleSelect">View as</label>
          <select
            id="roleSelect"
            value={role}
            onChange={e => onRoleChange(e.target.value as Role)}
          >
            {roles.map(r => (
              <option key={r} value={r}>{roleLabels[r]}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
