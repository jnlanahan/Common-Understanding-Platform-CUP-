/* ===== CUP — Common Understanding Platform : prototype app logic ===== */
(function () {
  const D = CUP_DATA;
  const content = document.getElementById("content");
  const drawer = document.getElementById("drawer");
  const drawerBody = document.getElementById("drawerBody");
  const drawerOverlay = document.getElementById("drawerOverlay");
  let currentRole = "Commander";

  /* ---------- helpers ---------- */
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const healthColor = (n) => (n >= 70 ? "var(--green)" : n >= 45 ? "var(--amber)" : "var(--red)");
  const sevBadge = (s) =>
    `<span class="badge b-${s}">${s}</span>`;
  const dotClass = (h) => (h === "green" ? "d-green" : h === "amber" ? "d-amber" : "d-red");

  /* ---------- top banner ---------- */
  function renderBanner() {
    const o = D.operation;
    document.getElementById("opBanner").innerHTML =
      `<strong>${o.unit}</strong> — ${o.name} · <strong>${o.phase}</strong> · DTG ${o.dtg} · CDR ${o.commander}`;
    document.getElementById("classification").textContent = o.classification;
  }

  /* ================= VIEWS ================= */
  const views = {};

  /* ----- Commander Dashboard ----- */
  views.dashboard = () => {
    const o = D.operation;
    const crit = D.changeFeed.filter((c) => c.severity === "critical").length;
    const warn = D.changeFeed.filter((c) => c.severity === "warning").length;
    const atRisk = D.assumptions.filter((a) => a.status === "At Risk" || a.status === "Failing").length;
    const openConflicts = D.conflicts.filter((c) => c.status !== "Resolved").length;
    const decReq = D.decisions.filter((d) => d.status === "Decision Required").length;

    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Commander Dashboard</h1>
        <p class="view-desc">What changed, why it matters, and what decisions are required — synthesized from every staff section's living estimate.</p>
      </div>`));

    // top row: health ring + stat tiles
    const top = el(`<div class="grid grid-4" style="margin-bottom:16px"></div>`);
    const c = o.overallHealth;
    const circ = 2 * Math.PI * 38;
    top.appendChild(el(`
      <div class="card">
        <p class="card-title">Plan Health Index</p>
        <div class="ring-wrap">
          <div class="ring">
            <svg width="92" height="92">
              <circle cx="46" cy="46" r="38" stroke="var(--panel-2)" stroke-width="9" fill="none"></circle>
              <circle cx="46" cy="46" r="38" stroke="${healthColor(c)}" stroke-width="9" fill="none"
                stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - c / 100)}"></circle>
            </svg>
            <div class="ring-txt" style="color:${healthColor(c)}">${c}</div>
          </div>
          <div>
            <div class="stat-label">Aggregate across<br/>${D.plans.length} active plans</div>
            <div class="stat-sub" style="margin-top:6px">Posture: ${o.posture}</div>
          </div>
        </div>
      </div>`));
    const tiles = [
      { v: decReq, l: "Decisions required now", s: "Commander action", color: "var(--critical)", view: "decisions" },
      { v: atRisk, l: "Assumptions failing / at risk", s: `of ${D.assumptions.length} tracked`, color: "var(--amber)", view: "assumptions" },
      { v: openConflicts, l: "Open cross-staff conflicts", s: `${crit} critical, ${warn} warnings in feed`, color: "var(--red)", view: "conflicts" },
    ];
    tiles.forEach((t) => {
      const card = el(`
        <div class="card stat" style="cursor:pointer">
          <div class="stat-val" style="color:${t.color}">${t.v}</div>
          <div class="stat-label">${t.l}</div>
          <div class="stat-sub">${t.s}</div>
        </div>`);
      card.onclick = () => navigate(t.view);
      top.appendChild(card);
    });
    wrap.appendChild(top);

    // commander summary + priority decisions
    const cols = el(`<div class="grid grid-2"></div>`);
    const sumCard = el(`<div class="card"><p class="card-title">Commander Update — auto-generated</p></div>`);
    const sl = el(`<ul class="sum-list"></ul>`);
    D.summaries.commander.forEach((s) => sl.appendChild(el(`<li>${s}</li>`)));
    sumCard.appendChild(sl);
    cols.appendChild(sumCard);

    const decCard = el(`<div class="card"><p class="card-title">Decisions approaching</p></div>`);
    D.decisions.forEach((d) => {
      const cls = d.status === "Decision Required" ? "req" : d.status === "Approaching" ? "appr" : "";
      const row = el(`
        <div class="card dec-card ${cls}" style="margin-bottom:10px;cursor:pointer;background:var(--panel-2)">
          <div class="row-between">
            <strong style="font-size:13.5px">${d.name}</strong>
            <span class="badge ${d.status === "Decision Required" ? "b-critical" : d.status === "Approaching" ? "b-warning" : "b-info"}">${d.status}</span>
          </div>
          <div class="kv">ETA <b>${d.eta}</b> · Owner <b>${d.owner}</b></div>
        </div>`);
      row.onclick = () => openDecision(d);
      decCard.appendChild(row);
    });
    cols.appendChild(decCard);
    wrap.appendChild(cols);

    // recent changes preview
    wrap.appendChild(el(`<div class="section-spacer"></div>`));
    const changeHead = el(`<div class="row-between" style="margin-bottom:10px"><p class="card-title" style="margin:0">Latest changes</p><span class="chip-link" id="seeAllChanges">See full feed →</span></div>`);
    wrap.appendChild(changeHead);
    D.changeFeed.slice(0, 3).forEach((c) => wrap.appendChild(feedItem(c)));
    wrap.querySelector("#seeAllChanges").onclick = () => navigate("changes");

    return wrap;
  };

  /* ----- Change feed ----- */
  function feedItem(c) {
    const item = el(`
      <div class="feed-item">
        <div class="feed-rail r-${c.severity}"></div>
        <div class="feed-main">
          <div class="feed-top">
            <span class="feed-time">${c.time}</span>
            ${sevBadge(c.severity)}
            <span class="feed-title">${c.title}</span>
          </div>
          <div class="feed-line"><b>What changed:</b> ${c.whatChanged}</div>
          <div class="feed-line"><b>Why it matters:</b> ${c.whyItMatters}</div>
          <div class="who-tags">${c.whoCares.map((w) => `<span class="who-tag">${w}</span>`).join("")}</div>
        </div>
      </div>`);
    item.onclick = () => openChange(c);
    return item;
  }
  views.changes = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Change Feed</h1>
        <p class="view-desc">Most information does not matter — changes do. Filtered for the <b>${currentRole}</b> role. Click any item for full context and links.</p>
      </div>`));
    const items = D.changeFeed.filter((c) => roleSeesChange(c));
    if (!items.length) wrap.appendChild(el(`<p class="muted">No changes flagged for this role.</p>`));
    items.forEach((c) => wrap.appendChild(feedItem(c)));
    return wrap;
  };
  function roleSeesChange(c) {
    if (currentRole === "Commander" || currentRole === "Staff") return true;
    return c.whoCares.includes(currentRole);
  }

  /* ----- Running estimates ----- */
  views.estimates = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Living Running Estimates</h1>
        <p class="view-desc">Each staff section maintains a continuously updated operational estimate. These replace static slides and trackers with a shared, always-current view.</p>
      </div>`));
    const grid = el(`<div class="grid grid-3"></div>`);
    let list = D.estimates;
    if (["S3", "S2", "S4", "S6"].includes(currentRole))
      list = D.estimates.filter((e) => e.section.startsWith(currentRole));
    if (!list.length) list = D.estimates;
    list.forEach((e) => {
      const card = el(`
        <div class="card">
          <div class="est-head">
            <span class="est-section">${e.section}</span>
            <span class="badge b-${e.health}"><span class="dot ${dotClass(e.health)}"></span>${e.health}</span>
          </div>
          <div class="est-meta">Owner ${e.owner} · updated ${e.updated}</div>
        </div>`);
      const blocks = [
        ["Facts", e.facts],
        ["Assumptions", e.assumptions],
        ["Constraints", e.constraints],
        ["Risks", e.risks],
        ["Opportunities", e.opportunities],
        ["Recommendations", e.recommendations],
        ["Info Gaps", e.gaps],
      ];
      blocks.forEach(([h, arr]) => {
        if (!arr || !arr.length) return;
        card.appendChild(el(`
          <div class="est-block">
            <h5>${h}</h5>
            <ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>
          </div>`));
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  /* ----- Assumptions ----- */
  views.assumptions = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Assumption Management</h1>
        <p class="view-desc">Plans are hypotheses. Every operational assumption is tracked with its owner, confidence, and live validity as supporting and contradicting evidence accumulates.</p>
      </div>`));
    const card = el(`<div class="card"></div>`);
    const tbl = el(`
      <table class="tbl">
        <thead><tr><th>Assumption</th><th>Owner</th><th>Confidence</th><th>Status</th><th style="width:160px">Validity</th></tr></thead>
        <tbody></tbody>
      </table>`);
    const tb = tbl.querySelector("tbody");
    D.assumptions.forEach((a) => {
      const statusBadge =
        a.status === "Valid" ? "b-green" :
        a.status === "Failing" ? "b-critical" :
        a.status === "At Risk" ? "b-warning" : "b-info";
      const tr = el(`
        <tr class="clickable">
          <td><b>${a.id.toUpperCase()}</b> — ${a.text}</td>
          <td>${a.owner}</td>
          <td>${a.confidence}</td>
          <td><span class="badge ${statusBadge}">${a.status}</span></td>
          <td>
            <div class="meter"><span style="width:${a.validity}%;background:${healthColor(a.validity)}"></span></div>
            <span class="muted" style="font-size:11px">${a.validity}% confidence in validity</span>
          </td>
        </tr>`);
      tr.onclick = () => openAssumption(a);
      tb.appendChild(tr);
    });
    card.appendChild(tbl);
    wrap.appendChild(card);
    return wrap;
  };

  /* ----- Plan health ----- */
  views.plans = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Plan Health Monitoring</h1>
        <p class="view-desc">Plans receive dynamic health assessments — feasibility, supportability, synchronization, and risk — recomputed as conditions and assumptions change.</p>
      </div>`));
    const grid = el(`<div class="grid grid-3"></div>`);
    D.plans.forEach((p) => {
      const dims = [
        ["Feasibility", p.feasibility],
        ["Supportability", p.supportability],
        ["Synchronization", p.synchronization],
      ];
      const card = el(`
        <div class="card">
          <div class="row-between" style="margin-bottom:4px">
            <strong style="font-size:14.5px">${p.name}</strong>
          </div>
          <div class="est-meta">${p.phase} · Risk: <b style="color:${p.risk === "High" ? "var(--red)" : p.risk === "Medium" ? "var(--amber)" : "var(--green)"}">${p.risk}</b></div>
          <div class="ring-wrap" style="margin:10px 0 14px">
            <div class="ring" style="width:64px;height:64px">
              <svg width="64" height="64" viewBox="0 0 92 92" style="width:64px;height:64px">
                <circle cx="46" cy="46" r="38" stroke="var(--panel-2)" stroke-width="9" fill="none"></circle>
                <circle cx="46" cy="46" r="38" stroke="${healthColor(p.health)}" stroke-width="9" fill="none"
                  stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 38}" stroke-dashoffset="${2 * Math.PI * 38 * (1 - p.health / 100)}"></circle>
              </svg>
              <div class="ring-txt" style="font-size:16px;color:${healthColor(p.health)}">${p.health}</div>
            </div>
            <div class="stat-label">Overall<br/>health</div>
          </div>
        </div>`);
      dims.forEach(([l, v]) => {
        card.appendChild(el(`
          <div class="bar-row">
            <span class="lbl">${l}</span>
            <span class="bar"><span style="width:${v}%;background:${healthColor(v)}"></span></span>
            <span class="bar-val">${v}</span>
          </div>`));
      });
      card.appendChild(el(`<p class="hint" style="margin-top:10px">${p.note}</p>`));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  /* ----- Conflicts ----- */
  views.conflicts = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Cross-Staff Conflict Detection</h1>
        <p class="view-desc">The platform flags where staff assessments are inconsistent — for example, when operations exceeds sustainment capability, or comms coverage does not support maneuver.</p>
      </div>`));
    D.conflicts.forEach((c) => {
      const card = el(`
        <div class="card" style="margin-bottom:14px;cursor:pointer">
          <div class="feed-top">
            ${sevBadge(c.severity)}
            <span class="feed-title">${c.title}</span>
            <span class="pill-counter">${c.sections.join(" ⇄ ")}</span>
            <span class="badge ${c.status === "Open" ? "b-red" : c.status === "Mitigating" ? "b-amber" : "b-green"}" style="margin-left:auto">${c.status}</span>
          </div>
          <div class="feed-line" style="margin-top:8px">${c.summary}</div>
          <div class="feed-line"><b>Recommendation:</b> ${c.recommendation}</div>
        </div>`);
      card.onclick = () => openConflict(c);
      wrap.appendChild(card);
    });
    return wrap;
  };

  /* ----- Decisions ----- */
  views.decisions = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Decision Support</h1>
        <p class="view-desc">The system surfaces decisions that are approaching, decisions affected by changing conditions, and the information required before each one. It informs — it never decides.</p>
      </div>`));
    const grid = el(`<div class="grid grid-3"></div>`);
    D.decisions.forEach((d) => {
      const cls = d.status === "Decision Required" ? "req" : d.status === "Approaching" ? "appr" : "";
      const card = el(`
        <div class="card dec-card ${cls}" style="cursor:pointer">
          <div class="row-between" style="margin-bottom:6px">
            <strong style="font-size:14px">${d.name}</strong>
          </div>
          <span class="badge ${d.status === "Decision Required" ? "b-critical" : d.status === "Approaching" ? "b-warning" : "b-info"}">${d.status}</span>
          <div class="kv" style="margin-top:10px">ETA <b>${d.eta}</b></div>
          <div class="kv">Owner <b>${d.owner}</b></div>
          <h5 class="est-block" style="margin:12px 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-faint)">Affected by</h5>
          <ul style="margin:0;padding-left:16px">${d.affectedBy.map((x) => `<li style="font-size:12.5px;color:var(--text-dim)">${x}</li>`).join("")}</ul>
        </div>`);
      card.onclick = () => openDecision(d);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  /* ----- Summaries ----- */
  views.summaries = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Context Summarization</h1>
        <p class="view-desc">Continuously generated updates for the commander and staff — no manual briefing prep. Each summary is derived live from the underlying context model.</p>
      </div>`));
    const grid = el(`<div class="grid grid-3"></div>`);
    const groups = [
      ["Commander Update", D.summaries.commander, "b-info"],
      ["Staff Tasks & Updates", D.summaries.staff, "b-green"],
      ["Risk Summary", D.summaries.risk, "b-red"],
    ];
    groups.forEach(([title, items, badge]) => {
      const card = el(`<div class="card"><p class="card-title">${title} <span class="badge ${badge}" style="margin-left:6px">${items.length}</span></p></div>`);
      const ul = el(`<ul class="sum-list"></ul>`);
      items.forEach((i) => ul.appendChild(el(`<li>${i}</li>`)));
      card.appendChild(ul);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  /* ----- Dependency graph ----- */
  views.graph = () => {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="view-head">
        <h1 class="view-title">Context Dependency Graph</h1>
        <p class="view-desc">A living map of how missions, tasks, units, resources, assumptions, and decisions depend on one another. Red dashed links carry at-risk assumptions. Click any node.</p>
      </div>`));

    const typeStyle = {
      mission: { fill: "#1c3a5e", stroke: "#4ea1ff", shape: "rect" },
      task: { fill: "#1f3340", stroke: "#6fe0c0", shape: "rect" },
      resource: { fill: "#2a2438", stroke: "#b98cff", shape: "rect" },
      unit: { fill: "#33301c", stroke: "#f5b14c", shape: "rect" },
      assumption: { fill: "#3a2026", stroke: "#ef5c6e", shape: "ellipse" },
      decision: { fill: "#102a2a", stroke: "#3ecf8e", shape: "diamond" },
    };

    let edgesSvg = "";
    D.graph.edges.forEach((e) => {
      const a = D.graph.nodes.find((n) => n.id === e.from);
      const b = D.graph.nodes.find((n) => n.id === e.to);
      edgesSvg += `<line class="g-edge ${e.risk ? "risk" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`;
    });

    let nodesSvg = "";
    D.graph.nodes.forEach((n) => {
      const s = typeStyle[n.type];
      const w = Math.max(96, n.label.length * 7);
      const h = 38;
      let shape;
      if (s.shape === "ellipse")
        shape = `<ellipse cx="${n.x}" cy="${n.y}" rx="${w / 2}" ry="${h / 2}" fill="${s.fill}" stroke="${s.stroke}"></ellipse>`;
      else if (s.shape === "diamond")
        shape = `<polygon points="${n.x},${n.y - 26} ${n.x + w / 2},${n.y} ${n.x},${n.y + 26} ${n.x - w / 2},${n.y}" fill="${s.fill}" stroke="${s.stroke}"></polygon>`;
      else
        shape = `<rect x="${n.x - w / 2}" y="${n.y - h / 2}" width="${w}" height="${h}" rx="7" fill="${s.fill}" stroke="${s.stroke}"></rect>`;
      nodesSvg += `<g class="g-node" data-node="${n.id}">${shape}<text x="${n.x}" y="${n.y + 4}" text-anchor="middle">${n.label}</text></g>`;
    });

    const gw = el(`
      <div class="graph-wrap">
        <svg class="graph-svg" viewBox="0 0 960 660" preserveAspectRatio="xMidYMid meet">
          ${edgesSvg}${nodesSvg}
        </svg>
        <div class="legend">
          <span><i style="background:#1c3a5e;border:1px solid #4ea1ff"></i> Mission</span>
          <span><i style="background:#1f3340;border:1px solid #6fe0c0"></i> Task</span>
          <span><i style="background:#2a2438;border:1px solid #b98cff"></i> Resource</span>
          <span><i style="background:#33301c;border:1px solid #f5b14c"></i> Unit</span>
          <span><i style="background:#3a2026;border:1px solid #ef5c6e;border-radius:50%"></i> Assumption</span>
          <span><i style="background:#102a2a;border:1px solid #3ecf8e;transform:rotate(45deg)"></i> Decision</span>
          <span><i style="background:transparent;border-top:2px dashed #ef5c6e"></i> At-risk dependency</span>
        </div>
      </div>`);
    wrap.appendChild(gw);
    // node clicks
    wrap.querySelectorAll(".g-node").forEach((g) => {
      g.addEventListener("click", () => openGraphNode(g.dataset.node));
    });
    return wrap;
  };

  /* ================= DRAWER ================= */
  function openDrawer(html) {
    drawerBody.innerHTML = html;
    drawer.classList.add("open");
    drawerOverlay.classList.add("open");
    // wire up any chip links inside drawer
    drawerBody.querySelectorAll("[data-link]").forEach((c) => {
      c.onclick = () => routeLink(c.dataset.link);
    });
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
  }
  document.getElementById("drawerClose").onclick = closeDrawer;
  drawerOverlay.onclick = closeDrawer;

  function linkChips(links) {
    if (!links) return "";
    const map = {
      assumption: "Assumption",
      plan: "Plan",
      conflict: "Conflict",
      decision: "Decision",
    };
    return Object.entries(links)
      .map(([k, v]) => `<span class="chip-link" data-link="${k}:${v}">${map[k] || k}: ${v.toUpperCase()}</span>`)
      .join("");
  }

  function openChange(c) {
    openDrawer(`
      <h3>${c.title}</h3>
      <p>${sevBadge(c.severity)} <span class="muted">· ${c.time}</span></p>
      <h4>What changed</h4><p>${c.whatChanged}</p>
      <h4>Why it matters</h4><p>${c.whyItMatters}</p>
      <h4>Who should care</h4>
      <div class="who-tags">${c.whoCares.map((w) => `<span class="who-tag">${w}</span>`).join("")}</div>
      <h4>Linked context</h4>
      <div>${linkChips(c.links) || '<span class="muted">No links</span>'}</div>`);
  }

  function openAssumption(a) {
    openDrawer(`
      <h3>${a.id.toUpperCase()}</h3>
      <p>${a.text}</p>
      <h4>Tracking</h4>
      <p>Owner <b style="color:var(--text)">${a.owner}</b> · Source ${a.source}<br/>
      Confidence ${a.confidence} · Established ${a.established}</p>
      <h4>Validity</h4>
      <div class="meter" style="max-width:220px"><span style="width:${a.validity}%;background:${healthColor(a.validity)}"></span></div>
      <p class="muted" style="font-size:12px">${a.validity}% — status: <b>${a.status}</b></p>
      <h4>Supporting evidence</h4>
      <ul>${(a.supporting.length ? a.supporting : ["—"]).map((x) => `<li class="ev-good">${x}</li>`).join("")}</ul>
      <h4>Contradicting evidence</h4>
      <ul>${(a.contradicting.length ? a.contradicting : ["—"]).map((x) => `<li class="ev-bad">${x}</li>`).join("")}</ul>`);
  }

  function openConflict(c) {
    openDrawer(`
      <h3>${c.title}</h3>
      <p>${sevBadge(c.severity)} · Sections ${c.sections.join(" ⇄ ")} · Status <b>${c.status}</b></p>
      <h4>Summary</h4><p>${c.summary}</p>
      <h4>Recommendation</h4><p>${c.recommendation}</p>
      <h4>Linked context</h4>
      <div>${linkChips(c.links) || '<span class="muted">No links</span>'}</div>`);
  }

  function openDecision(d) {
    openDrawer(`
      <h3>${d.name}</h3>
      <p><span class="badge ${d.status === "Decision Required" ? "b-critical" : d.status === "Approaching" ? "b-warning" : "b-info"}">${d.status}</span>
      · ETA <b>${d.eta}</b> · Owner <b>${d.owner}</b></p>
      <h4>Affected by changing conditions</h4>
      <ul>${d.affectedBy.map((x) => `<li>${x}</li>`).join("")}</ul>
      <h4>Information required before decision</h4>
      <ul>${d.infoRequired.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p class="hint">CUP supports this decision — it does not make it. Judgment remains with the commander.</p>`);
  }

  function openGraphNode(id) {
    const n = D.graph.nodes.find((x) => x.id === id);
    if (!n) return;
    const inbound = D.graph.edges.filter((e) => e.to === id).map((e) => D.graph.nodes.find((x) => x.id === e.from).label);
    const outbound = D.graph.edges.filter((e) => e.from === id).map((e) => D.graph.nodes.find((x) => x.id === e.to).label);
    openDrawer(`
      <h3>${n.label}</h3>
      <p><span class="badge b-info">${n.type}</span></p>
      <h4>Depends on</h4>
      <ul>${(inbound.length ? inbound : ["—"]).map((x) => `<li>${x}</li>`).join("")}</ul>
      <h4>Supports / feeds</h4>
      <ul>${(outbound.length ? outbound : ["—"]).map((x) => `<li>${x}</li>`).join("")}</ul>
      <p class="hint">Changes to this node ripple along these dependencies — that's how CUP determines what a change means for the operation.</p>`);
  }

  /* route chip links to the right detail */
  function routeLink(spec) {
    const [type, id] = spec.split(":");
    if (type === "assumption") { const a = D.assumptions.find((x) => x.id === id); if (a) openAssumption(a); }
    else if (type === "conflict") { const c = D.conflicts.find((x) => x.id === id); if (c) openConflict(c); }
    else if (type === "decision") { const d = D.decisions.find((x) => x.id === id); if (d) openDecision(d); }
    else if (type === "plan") { navigate("plans"); closeDrawer(); }
  }

  /* ================= NAV ================= */
  function navigate(view) {
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    content.innerHTML = "";
    content.appendChild(views[view]());
    content.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  document.querySelectorAll(".nav-item").forEach((b) => {
    b.onclick = () => navigate(b.dataset.view);
  });

  document.getElementById("roleSelect").onchange = (e) => {
    currentRole = e.target.value;
    const active = document.querySelector(".nav-item.active").dataset.view;
    navigate(active);
  };

  /* ================= INIT ================= */
  renderBanner();
  navigate("dashboard");
})();
