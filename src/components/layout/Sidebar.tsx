import type { ViewId } from '../../data/types'

interface NavItem {
  id: ViewId
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',   icon: '▣', label: 'Commander Dashboard' },
  { id: 'changes',     icon: '⟳', label: 'Change Feed' },
  { id: 'estimates',   icon: '▤', label: 'Running Estimates' },
  { id: 'assumptions', icon: '◈', label: 'Assumptions' },
  { id: 'graph',       icon: '⬡', label: 'Dependency Graph' },
  { id: 'plans',       icon: '♥', label: 'Plan Health' },
  { id: 'conflicts',   icon: '⚠', label: 'Conflicts' },
  { id: 'decisions',   icon: '◎', label: 'Decisions' },
  { id: 'summaries',   icon: '✎', label: 'Summaries' },
]

interface Props {
  activeView: ViewId
  onNavigate: (view: ViewId) => void
}

export function Sidebar({ activeView, onNavigate }: Props) {
  return (
    <nav className="sidebar">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-item${activeView === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-ico">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div className="sidebar-foot">
        <span className="live-dot" />
        Live context model
        <div className="sidebar-note">Prototype · dummy data</div>
      </div>
    </nav>
  )
}
