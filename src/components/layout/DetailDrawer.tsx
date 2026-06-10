import type { DrawerContent, ViewId } from '../../data/types'
import { SeverityBadge } from '../shared/SeverityBadge'
import { healthColor } from '../shared/HealthRing'
import scenario from '../../data/scenario'

interface Props {
  content: DrawerContent | null
  onClose: () => void
  onOpenDrawer: (content: DrawerContent) => void
  onNavigate: (view: ViewId) => void
}

function LinkChips({ links, onOpenDrawer, onNavigate }: {
  links: Record<string, string | undefined>
  onOpenDrawer: (c: DrawerContent) => void
  onNavigate: (v: ViewId) => void
}) {
  const entries = Object.entries(links).filter(([, v]) => v != null) as [string, string][]
  if (!entries.length) return <span className="muted">No links</span>

  const labels: Record<string, string> = {
    assumption: 'Assumption',
    plan: 'Plan',
    conflict: 'Conflict',
    decision: 'Decision',
  }

  function handleClick(type: string, id: string) {
    if (type === 'assumption') {
      const item = scenario.assumptions.find(a => a.id === id)
      if (item) onOpenDrawer({ type: 'assumption', item })
    } else if (type === 'conflict') {
      const item = scenario.conflicts.find(c => c.id === id)
      if (item) onOpenDrawer({ type: 'conflict', item })
    } else if (type === 'decision') {
      const item = scenario.decisions.find(d => d.id === id)
      if (item) onOpenDrawer({ type: 'decision', item })
    } else if (type === 'plan') {
      onNavigate('plans')
      onOpenDrawer({ type: 'node', nodeId: '' }) // close drawer, go to plans
    }
  }

  return (
    <div>
      {entries.map(([type, id]) => (
        <span key={`${type}-${id}`} className="chip-link" onClick={() => handleClick(type, id)}>
          {labels[type] || type}: {id.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

function ChangeDetail({ content, onOpenDrawer, onNavigate }: {
  content: Extract<DrawerContent, { type: 'change' }>
  onOpenDrawer: (c: DrawerContent) => void
  onNavigate: (v: ViewId) => void
}) {
  const { item: c } = content
  return (
    <>
      <h3>{c.title}</h3>
      <p><SeverityBadge severity={c.severity} /> <span className="muted">· {c.time}</span></p>
      <h4>What changed</h4><p>{c.whatChanged}</p>
      <h4>Why it matters</h4><p>{c.whyItMatters}</p>
      <h4>Who should care</h4>
      <div className="who-tags">
        {c.whoCares.map(w => <span key={w} className="who-tag">{w}</span>)}
      </div>
      <h4>Linked context</h4>
      <LinkChips links={c.links as Record<string, string>} onOpenDrawer={onOpenDrawer} onNavigate={onNavigate} />
    </>
  )
}

function AssumptionDetail({ content }: { content: Extract<DrawerContent, { type: 'assumption' }> }) {
  const { item: a } = content
  return (
    <>
      <h3>{a.id.toUpperCase()}</h3>
      <p>{a.text}</p>
      <h4>Tracking</h4>
      <p>
        Owner <b style={{ color: 'var(--text)' }}>{a.owner}</b> · Source {a.source}<br />
        Confidence {a.confidence} · Established {a.established}
      </p>
      <h4>Validity</h4>
      <div className="meter" style={{ maxWidth: 220 }}>
        <span style={{ width: `${a.validity}%`, background: healthColor(a.validity) }} />
      </div>
      <p className="muted" style={{ fontSize: 12 }}>{a.validity}% — status: <b>{a.status}</b></p>
      <h4>Supporting evidence</h4>
      <ul>
        {(a.supporting.length ? a.supporting : ['—']).map((x, i) => (
          <li key={i} className="ev-good">{x}</li>
        ))}
      </ul>
      <h4>Contradicting evidence</h4>
      <ul>
        {(a.contradicting.length ? a.contradicting : ['—']).map((x, i) => (
          <li key={i} className="ev-bad">{x}</li>
        ))}
      </ul>
    </>
  )
}

function ConflictDetail({ content, onOpenDrawer, onNavigate }: {
  content: Extract<DrawerContent, { type: 'conflict' }>
  onOpenDrawer: (c: DrawerContent) => void
  onNavigate: (v: ViewId) => void
}) {
  const { item: c } = content
  return (
    <>
      <h3>{c.title}</h3>
      <p>
        <SeverityBadge severity={c.severity} /> · Sections {c.sections.join(' ⇄ ')} · Status <b>{c.status}</b>
      </p>
      <h4>Summary</h4><p>{c.summary}</p>
      <h4>Recommendation</h4><p>{c.recommendation}</p>
      <h4>Linked context</h4>
      <LinkChips links={c.links as Record<string, string>} onOpenDrawer={onOpenDrawer} onNavigate={onNavigate} />
    </>
  )
}

function DecisionDetail({ content }: { content: Extract<DrawerContent, { type: 'decision' }> }) {
  const { item: d } = content
  const statusCls = d.status === 'Decision Required' ? 'b-critical' : d.status === 'Approaching' ? 'b-warning' : 'b-info'
  return (
    <>
      <h3>{d.name}</h3>
      <p>
        <span className={`badge ${statusCls}`}>{d.status}</span>
        {' '}· ETA <b>{d.eta}</b> · Owner <b>{d.owner}</b>
      </p>
      <h4>Affected by changing conditions</h4>
      <ul>{d.affectedBy.map((x, i) => <li key={i}>{x}</li>)}</ul>
      <h4>Information required before decision</h4>
      <ul>{d.infoRequired.map((x, i) => <li key={i}>{x}</li>)}</ul>
      <p className="hint">CUP supports this decision — it does not make it. Judgment remains with the commander.</p>
    </>
  )
}

function NodeDetail({ nodeId, onOpenDrawer }: {
  nodeId: string
  onOpenDrawer: (c: DrawerContent) => void
}) {
  const { nodes, edges } = scenario.graph
  const node = nodes.find(n => n.id === nodeId)
  if (!node) return null

  const inbound = edges.filter(e => e.to === nodeId).map(e => nodes.find(n => n.id === e.from)?.label).filter(Boolean)
  const outbound = edges.filter(e => e.from === nodeId).map(e => nodes.find(n => n.id === e.to)?.label).filter(Boolean)

  // If it's an assumption node, link to the assumption detail
  const relatedAsm = scenario.assumptions.find(a => node.label.toLowerCase().includes(a.id))

  return (
    <>
      <h3>{node.label}</h3>
      <p><span className="badge b-info">{node.type}</span></p>
      {relatedAsm && (
        <p>
          <span className="chip-link" onClick={() => onOpenDrawer({ type: 'assumption', item: relatedAsm })}>
            View assumption detail →
          </span>
        </p>
      )}
      <h4>Depends on</h4>
      <ul>{(inbound.length ? inbound : ['—']).map((x, i) => <li key={i}>{x}</li>)}</ul>
      <h4>Supports / feeds</h4>
      <ul>{(outbound.length ? outbound : ['—']).map((x, i) => <li key={i}>{x}</li>)}</ul>
      <p className="hint">Changes to this node ripple along these dependencies — that's how CUP determines what a change means for the operation.</p>
    </>
  )
}

export function DetailDrawer({ content, onClose, onOpenDrawer, onNavigate }: Props) {
  const isOpen = content !== null

  return (
    <>
      <div className={`drawer-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
      <aside className={`drawer${isOpen ? ' open' : ''}`}>
        <button className="drawer-close" onClick={onClose}>✕</button>
        <div className="drawer-body">
          {content?.type === 'change' && (
            <ChangeDetail content={content} onOpenDrawer={onOpenDrawer} onNavigate={onNavigate} />
          )}
          {content?.type === 'assumption' && (
            <AssumptionDetail content={content} />
          )}
          {content?.type === 'conflict' && (
            <ConflictDetail content={content} onOpenDrawer={onOpenDrawer} onNavigate={onNavigate} />
          )}
          {content?.type === 'decision' && (
            <DecisionDetail content={content} />
          )}
          {content?.type === 'node' && content.nodeId && (
            <NodeDetail nodeId={content.nodeId} onOpenDrawer={onOpenDrawer} />
          )}
        </div>
      </aside>
    </>
  )
}
