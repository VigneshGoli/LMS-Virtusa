import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const HomeRedirect = () => {
  const { state } = useAuth()
  if (state.status === 'loading') return null
  if (state.status !== 'authenticated') return <Navigate to="/login" replace />

  return state.user.role === 'ADMIN' ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/books/available" replace />
  )
}

export default HomeRedirect

