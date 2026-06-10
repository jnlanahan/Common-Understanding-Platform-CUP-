import type { DrawerContent, Role } from '../data/types'
import scenario from '../data/scenario'

interface Props {
  role: Role
  onOpenDrawer: (content: DrawerContent) => void
}

function roleSeesChange(whoCares: string[], role: Role) {
  if (role === 'Commander' || role === 'Staff Primary') return true
  return whoCares.includes(role)
}

export function ChangeFeedView({ role, onOpenDrawer }: Props) {
  const items = scenario.changeFeed.filter(c => roleSeesChange(c.whoCares, role))

  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Change Feed</h1>
        <p className="view-desc">
          Most information does not matter — changes do. Filtered for the <b>{role}</b> role. Click any item for full context and links.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="muted">No changes flagged for this role.</p>
      ) : (
        items.map(c => (
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
        ))
      )}
    </div>
  )
}
