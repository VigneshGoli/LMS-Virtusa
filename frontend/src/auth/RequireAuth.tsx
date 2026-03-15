import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const RequireAuth = () => {
  const { state } = useAuth()
  const location = useLocation()

  if (state.status === 'loading') return null
  if (state.status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export const RequireRole = ({ role }: { role: 'ADMIN' | 'STUDENT' }) => {
  const { state } = useAuth()
  if (state.status !== 'authenticated') return null
  if (state.user.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}

