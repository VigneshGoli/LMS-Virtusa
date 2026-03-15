import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const TopBar = () => {
  const navigate = useNavigate()
  const { state, logout } = useAuth()
  const user = state.status === 'authenticated' ? state.user : null

  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6 lg:px-8">
      <div className="flex items-center gap-3 md:gap-4">
        <a
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="MLR Institute of Technology"
        >
          <img
            src="/mlrit-full-logo.png"
            alt="MLR Institute of Technology"
            className="h-14 w-auto object-contain md:h-16"
          />
        </a>
        <div className="hidden border-l border-slate-200 pl-4 md:block">
          <p className="text-sm font-semibold text-slate-800">
            Library Management System
          </p>
          <p className="text-xs text-slate-500">
            Digital Library Portal
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <a
          href="tel:18005724363"
          className="flex items-center gap-2 text-sm text-amber-700 hover:text-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2 3a1 1 0 0 1 1-1h2.153a1 1 0 0 1 .986.836l.74 4.435a1 1 0 0 1-.54 1.06l-1.548.773a11.037 11.037 0 0 0 6.105 6.105l.774-1.548a1 1 0 0 1 1.059-.54l4.435.74a1 1 0 0 1 .836.986V17a1 1 0 0 1-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </span>
          <span className="hidden lg:inline">Toll Free: 1800 572 4363</span>
        </a>
        <div className="rounded bg-red-600 px-3 py-2 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-white">
            EAPCET CODE : MLID
          </span>
        </div>

        {user && (
          <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex">
            {user.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user.name?.slice(0, 1)?.toUpperCase()}
              </div>
            )}
            <div className="leading-tight">
              <div className="text-xs font-semibold text-slate-800">{user.name}</div>
              <div className="text-[11px] text-slate-500">
                {user.role === 'ADMIN' ? 'Administrator' : 'Student'} • {user.email}
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await logout()
                } finally {
                  navigate('/login', { replace: true })
                }
              }}
              className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar

