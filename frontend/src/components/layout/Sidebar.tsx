import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../auth/AuthContext'

const navItemClass =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors'

const navSectionClass = 'mt-5 border-t border-slate-200 pt-4'

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
    {children}
  </div>
)

const baseLinkClasses =
  'text-slate-600 hover:bg-neutral-100 hover:text-slate-900 aria-[current=page]:bg-primary/5 aria-[current=page]:text-primary aria-[current=page]:ring-1 aria-[current=page]:ring-primary/40'

const Sidebar = () => {
  const { state } = useAuth()
  const role = state.status === 'authenticated' ? state.user.role : null
  const isAdmin = role === 'ADMIN'

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 text-slate-900 lg:flex">
      <div className="mb-8 flex justify-center px-2">
        <img
          src="/mlrit-favicon.png"
          alt="MLRIT"
          className="h-14 w-14 object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col space-y-0.5 text-sm">
        {isAdmin && (
          <>
            <SectionLabel>Overview</SectionLabel>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M3 3h6v6H3V3zm8 0h6v4h-6V3zM3 11h6v6H3v-6zm8 4h6v2h-6v-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Dashboard</span>
            </NavLink>
          </>
        )}

        <div className={navSectionClass}>
          <SectionLabel>Catalogue</SectionLabel>
          <NavLink to="/books" className={({ isActive }) => `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`}>
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  d="M5 3h9a2 2 0 0 1 2 2v11h-1.5l-1-1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>Library Catalogue</span>
          </NavLink>
          <NavLink to="/books/available" className={({ isActive }) => `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`}>
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  d="M4 4h12v2H4V4zm0 4h7v2H4V8zm0 4h5v2H4v-2z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>Available Books</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/books/add" className={({ isActive }) => `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`}>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    d="M10 4a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 0 1 0-2h3V5a1 1 0 0 1 1-1z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Add New Book</span>
            </NavLink>
          )}
        </div>

        {role === 'STUDENT' && (
          <div className={navSectionClass}>
            <SectionLabel>Student Services</SectionLabel>
            <NavLink
              to="/my/issued"
              className={({ isActive }) =>
                `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M4 3h12v2H4V3zm0 4h12v2H4V7zm0 4h8v2H4v-2zm0 4h6v2H4v-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>My Issued Books</span>
            </NavLink>
          </div>
        )}

        {isAdmin && (
          <div className={navSectionClass}>
            <SectionLabel>Circulation</SectionLabel>
            <NavLink
              to="/books/issue"
              className={({ isActive }) =>
                `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M4 4h12v2H4V4zm2 4h10v2H6V8zm2 4h8v2H8v-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Issue Book</span>
            </NavLink>
            <NavLink
              to="/books/return"
              className={({ isActive }) =>
                `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M5 4h10v2H5V4zm0 4h6v2H5V8zm0 4h10v2H5v-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Return Book</span>
            </NavLink>
          </div>
        )}

        {isAdmin && (
          <div className={navSectionClass}>
            <SectionLabel>Records & Analytics</SectionLabel>
            <NavLink
              to="/issued"
              className={({ isActive }) =>
                `${navItemClass} ${baseLinkClasses} ${isActive ? 'aria-[current=page]:bg-primary/5' : ''}`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M4 11h3v5H4v-5zm5-4h3v9H9V7zm5-3h3v12h-3V4z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Issued Records</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 px-4 py-3 text-[11px] text-slate-700 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          MLRIT Library Services
        </div>
        <div className="mt-1 text-[11px] text-slate-600">
          Official digital portal for circulation, cataloguing, and analytics of
          MLR Institute of Technology Central Library.
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
