import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { fetchMe, logout as apiLogout } from '../services/authApi'
import type { AuthUser } from '../services/authApi'

type AuthState =
  | { status: 'loading'; user: null }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated'; user: null }

interface AuthContextValue {
  state: AuthState
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null })

  const refresh = useCallback(async () => {
    try {
      const me = await fetchMe()
      setState({ status: 'authenticated', user: me })
    } catch {
      setState({ status: 'unauthenticated', user: null })
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    await apiLogout()
    setState({ status: 'unauthenticated', user: null })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ state, refresh, logout }),
    [state, refresh, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

