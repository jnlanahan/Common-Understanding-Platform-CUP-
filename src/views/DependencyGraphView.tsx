import type { DrawerContent, NodeType } from '../data/types'
import scenario from '../data/scenario'

interface Props {
  onOpenDrawer: (content: DrawerContent) => void
}

const typeStyle: Record<NodeType, { fill: string; stroke: string; shape: 'rect' | 'ellipse' | 'diamond' }> = {
  mission:    { fill: '#1c3a5e', stroke: '#4ea1ff',  shape: 'rect' },
  task:       { fill: '#1f3340', stroke: '#6fe0c0',  shape: 'rect' },
  resource:   { fill: '#2a2438', stroke: '#b98cff',  shape: 'rect' },
  unit:       { fill: '#33301c', stroke: '#f5b14c',  shape: 'rect' },
  assumption: { fill: '#3a2026', stroke: '#ef5c6e',  shape: 'ellipse' },
  decision:   { fill: '#102a2a', stroke: '#3ecf8e',  shape: 'diamond' },
}

export function DependencyGraphView({ onOpenDrawer }: Props) {
  const { nodes, edges } = scenario.graph

  function handleNodeClick(nodeId: string) {
    onOpenDrawer({ type: 'node', nodeId })
  }

  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Context Dependency Graph</h1>
        <p className="view-desc">
          A living map of how missions, tasks, units, resources, assumptions, and decisions depend on one another. Red dashed links carry at-risk assumptions. Click any node.
        </p>
      </div>

      <div className="graph-wrap">
        <svg
          className="graph-svg"
          viewBox="0 0 960 660"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges */}
          {edges.map((e, i) => {
            const a = nodes.find(n => n.id === e.from)
            const b = nodes.find(n => n.id === e.to)
            if (!a || !b) return null
            return (
              <line
                key={i}
                className={`g-edge${e.risk ? ' risk' : ''}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const s = typeStyle[n.type]
            const w = Math.max(96, n.label.length * 7)
            const h = 38

            let shape
            if (s.shape === 'ellipse') {
              shape = (
                <ellipse
                  cx={n.x} cy={n.y}
                  rx={w / 2} ry={h / 2}
                  fill={s.fill} stroke={s.stroke} strokeWidth="1.5"
                />
              )
            } else if (s.shape === 'diamond') {
              shape = (
                <polygon
                  points={`${n.x},${n.y - 26} ${n.x + w / 2},${n.y} ${n.x},${n.y + 26} ${n.x - w / 2},${n.y}`}
                  fill={s.fill} stroke={s.stroke} strokeWidth="1.5"
                />
              )
            } else {
              shape = (
                <rect
                  x={n.x - w / 2} y={n.y - h / 2}
                  width={w} height={h} rx="7"
                  fill={s.fill} stroke={s.stroke} strokeWidth="1.5"
                />
              )
            }

            return (
              <g
                key={n.id}
                className="g-node"
                onClick={() => handleNodeClick(n.id)}
              >
                {shape}
                <text
                  x={n.x} y={n.y + 4}
                  textAnchor="middle"
                  style={{ fontSize: 11.5, fill: 'var(--text)', fontFamily: 'inherit' }}
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="legend">
          <span><i style={{ background: '#1c3a5e', border: '1px solid #4ea1ff' }} /> Mission</span>
          <span><i style={{ background: '#1f3340', border: '1px solid #6fe0c0' }} /> Task</span>
          <span><i style={{ background: '#2a2438', border: '1px solid #b98cff' }} /> Resource</span>
          <span><i style={{ background: '#33301c', border: '1px solid #f5b14c' }} /> Unit</span>
          <span><i style={{ background: '#3a2026', border: '1px solid #ef5c6e', borderRadius: '50%' }} /> Assumption</span>
          <span><i style={{ background: '#102a2a', border: '1px solid #3ecf8e', transform: 'rotate(45deg)' }} /> Decision</span>
          <span><i style={{ background: 'transparent', borderTop: '2px dashed #ef5c6e' }} /> At-risk dependency</span>
        </div>
      </div>
    </div>
  )
}
