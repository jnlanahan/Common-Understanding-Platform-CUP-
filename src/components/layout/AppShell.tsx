import type { ReactNode } from 'react'
import type { DrawerContent, Role, ViewId } from '../../data/types'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { DetailDrawer } from './DetailDrawer'
import scenario from '../../data/scenario'

interface Props {
  activeView: ViewId
  role: Role
  drawerContent: DrawerContent | null
  onNavigate: (view: ViewId) => void
  onRoleChange: (role: Role) => void
  onCloseDrawer: () => void
  onOpenDrawer: (content: DrawerContent) => void
  children: ReactNode
}

export function AppShell({
  activeView, role, drawerContent,
  onNavigate, onRoleChange, onCloseDrawer, onOpenDrawer,
  children,
}: Props) {
  return (
    <>
      <TopBar
        operation={scenario.operation}
        role={role}
        onRoleChange={onRoleChange}
      />
      <div className="layout">
        <Sidebar activeView={activeView} onNavigate={onNavigate} />
        <main className="content">{children}</main>
      </div>
      <DetailDrawer
        content={drawerContent}
        onClose={onCloseDrawer}
        onOpenDrawer={onOpenDrawer}
        onNavigate={onNavigate}
      />
    </>
  )
}
