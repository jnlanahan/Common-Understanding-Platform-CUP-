import scenario from '../data/scenario'

export function SummariesView() {
  const { summaries } = scenario

  const groups: [string, string[], string][] = [
    ['Commander Update', summaries.commander, 'b-info'],
    ['Staff Tasks & Updates', summaries.staff, 'b-green'],
    ['Risk Summary', summaries.risk, 'b-red'],
  ]

  return (
    <div>
      <div className="view-head">
        <h1 className="view-title">Context Summarization</h1>
        <p className="view-desc">
          Continuously generated updates for the commander and staff — no manual briefing prep. Each summary is derived live from the underlying context model.
        </p>
      </div>

      <div className="grid grid-3">
        {groups.map(([title, items, badge]) => (
          <div key={title} className="card">
            <p className="card-title">
              {title} <span className={`badge ${badge}`} style={{ marginLeft: 6 }}>{items.length}</span>
            </p>
            <ul className="sum-list">
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
