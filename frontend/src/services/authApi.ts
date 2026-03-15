import { apiClient } from './apiClient'

export type Role = 'ADMIN' | 'STUDENT'

export interface AuthUser {
  id: number
  email: string
  name: string
  pictureUrl?: string | null
  rollNumber?: string | null
  branch?: string | null
  role: Role
}

export const loginWithEmailPassword = async (email: string, password: string) => {
  const res = await apiClient.post<AuthUser>('/api/auth/login', { email, password })
  return res.data
}

export const fetchMe = async () => {
  const res = await apiClient.get<AuthUser>('/api/auth/me')
  return res.data
}

export const logout = async () => {
  await apiClient.post('/api/auth/logout')
}

