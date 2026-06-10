import { useState } from 'react'
import type { DrawerContent, Role, ViewId } from './data/types'
import { AppShell } from './components/layout/AppShell'
import { DashboardView } from './views/DashboardView'
import { ChangeFeedView } from './views/ChangeFeedView'
import { RunningEstimatesView } from './views/RunningEstimatesView'
import { AssumptionsView } from './views/AssumptionsView'
import { DependencyGraphView } from './views/DependencyGraphView'
import { PlanHealthView } from './views/PlanHealthView'
import { ConflictsView } from './views/ConflictsView'
import { DecisionsView } from './views/DecisionsView'
import { SummariesView } from './views/SummariesView'

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard')
  const [activeRole, setActiveRole] = useState<Role>('Commander')
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null)

  function handleNavigate(view: ViewId) {
    setActiveView(view)
    setDrawerContent(null)
  }

  const viewProps = {
    role: activeRole,
    onOpenDrawer: setDrawerContent,
    onNavigate: handleNavigate,
  }

  function renderView() {
    switch (activeView) {
      case 'dashboard':   return <DashboardView {...viewProps} />
      case 'changes':     return <ChangeFeedView {...viewProps} />
      case 'estimates':   return <RunningEstimatesView role={activeRole} />
      case 'assumptions': return <AssumptionsView onOpenDrawer={setDrawerContent} />
      case 'graph':       return <DependencyGraphView onOpenDrawer={setDrawerContent} />
      case 'plans':       return <PlanHealthView />
      case 'conflicts':   return <ConflictsView onOpenDrawer={setDrawerContent} />
      case 'decisions':   return <DecisionsView onOpenDrawer={setDrawerContent} />
      case 'summaries':   return <SummariesView />
    }
  }

  return (
    <AppShell
      activeView={activeView}
      role={activeRole}
      drawerContent={drawerContent}
      onNavigate={handleNavigate}
      onRoleChange={setActiveRole}
      onCloseDrawer={() => setDrawerContent(null)}
      onOpenDrawer={setDrawerContent}
    >
      {renderView()}
    </AppShell>
  )
}
