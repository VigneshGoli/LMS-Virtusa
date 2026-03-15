import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

interface AppLayoutProps {
  children?: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-50 via-white to-neutral-50 p-5 lg:p-8">
          <div className="mx-auto max-w-6xl">{children ?? <Outlet />}</div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default AppLayout

