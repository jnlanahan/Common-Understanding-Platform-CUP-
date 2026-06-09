# Common Understanding Platform (CUP)

An **Operational Context Management** platform that helps Army staffs maintain a shared
understanding of the operational environment across planning, execution, and assessment.

> CUP continuously answers the commander's most important question:
> **"Given everything that has changed, what does it mean for the operation?"**

See [`PRD.md`](./PRD.md) for the full product requirements document.

---

## Clickable Prototype

This repo includes a fully clickable, **no-build** prototype that brings the PRD to life
with realistic dummy data. It is framework-free (plain HTML/CSS/JS) so it runs anywhere.

### Run it

Just open the file in a browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or serve it (recommended, avoids any file:// quirks):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### What you can click through

The prototype demonstrates every core capability from the PRD, wired around a single
fictional scenario — **3rd Armored Brigade Combat Team conducting Operation STEEL RESOLVE**
(a wet-gap crossing and seizure of OBJ FALCON):

| View | PRD Capability |
| --- | --- |
| **Commander Dashboard** | The "what changed, why it matters, what decisions are required" synthesis |
| **Change Feed** | Focus on change — every entry tagged with what changed / why it matters / who cares |
| **Running Estimates** | Living running estimates per warfighting function (S2/S3/S4/S6/Fires/Engineer) |
| **Assumptions** | Assumption management with confidence, evidence for/against, and live validity |
| **Dependency Graph** | Context dependency graph linking missions, tasks, units, resources, assumptions, decisions |
| **Plan Health** | Dynamic feasibility / supportability / synchronization / risk scoring |
| **Conflicts** | Cross-staff conflict detection (e.g. ops exceeds sustainment) |
| **Decisions** | Decision support — approaching decisions and the info required before each |
| **Summaries** | Auto-generated commander / staff / risk summaries |

### Interactions to try

- **Switch roles** (top-right) to filter the Change Feed and Running Estimates by staff section.
- **Click any change, assumption, conflict, decision, or graph node** to open a detail drawer.
- **Follow the linked-context chips** inside a drawer to jump between related items
  (e.g. a fuel change → the failing assumption → the cross-staff conflict it drives).
- **Click dashboard stat tiles** to jump straight to the relevant view.

> All data is fictional and for demonstration only.

---

## Project structure

```
.
├── index.html          # App shell
├── assets/
│   ├── styles.css      # Command-post dark theme
│   ├── data.js         # Dummy operational dataset (the scenario)
│   └── app.js          # Views, navigation, drawer, dependency graph
├── PRD.md              # Product Requirements Document
└── README.md
```
