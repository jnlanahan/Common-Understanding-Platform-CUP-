export type Severity = 'critical' | 'warning' | 'info'
export type Health = 'green' | 'amber' | 'red'
export type Role = 'Commander' | 'S3' | 'S2' | 'S4' | 'S6' | 'Staff Primary'
export type ViewId =
  | 'dashboard'
  | 'changes'
  | 'estimates'
  | 'assumptions'
  | 'graph'
  | 'plans'
  | 'conflicts'
  | 'decisions'
  | 'summaries'

export interface Operation {
  name: string
  unit: string
  phase: string
  classification: string
  dtg: string
  commander: string
  posture: string
  overallHealth: number
}

export interface ChangeLinks {
  assumption?: string
  plan?: string
  conflict?: string
  decision?: string
}

export interface ChangeEntry {
  id: string
  time: string
  severity: Severity
  title: string
  whatChanged: string
  whyItMatters: string
  whoCares: string[]
  links: ChangeLinks
}

export interface RunningEstimate {
  id: string
  section: string
  owner: string
  health: Health
  updated: string
  facts: string[]
  assumptions: string[]
  constraints: string[]
  risks: string[]
  opportunities: string[]
  recommendations: string[]
  gaps: string[]
}

export type AssumptionStatus = 'Valid' | 'At Risk' | 'Failing' | 'Unconfirmed'

export interface Assumption {
  id: string
  text: string
  owner: string
  source: string
  confidence: string
  status: AssumptionStatus
  established: string
  supporting: string[]
  contradicting: string[]
  validity: number
}

export interface Plan {
  id: string
  name: string
  phase: string
  health: number
  feasibility: number
  supportability: number
  synchronization: number
  risk: 'High' | 'Medium' | 'Low'
  note: string
}

export interface ConflictLinks {
  assumption?: string
  decision?: string
  plan?: string
}

export interface Conflict {
  id: string
  title: string
  severity: Severity
  sections: string[]
  summary: string
  recommendation: string
  status: 'Open' | 'Mitigating' | 'Resolved'
  links: ConflictLinks
}

export interface Decision {
  id: string
  name: string
  eta: string
  status: 'Decision Required' | 'Approaching' | 'Monitoring'
  owner: string
  affectedBy: string[]
  infoRequired: string[]
}

export type NodeType = 'mission' | 'task' | 'resource' | 'unit' | 'assumption' | 'decision'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
  risk?: boolean
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface Summaries {
  commander: string[]
  staff: string[]
  risk: string[]
}

export interface CupData {
  operation: Operation
  changeFeed: ChangeEntry[]
  estimates: RunningEstimate[]
  assumptions: Assumption[]
  plans: Plan[]
  conflicts: Conflict[]
  decisions: Decision[]
  graph: GraphData
  summaries: Summaries
}

export type DrawerContent =
  | { type: 'change'; item: ChangeEntry }
  | { type: 'assumption'; item: Assumption }
  | { type: 'conflict'; item: Conflict }
  | { type: 'decision'; item: Decision }
  | { type: 'node'; nodeId: string }
