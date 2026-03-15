import { apiClient } from './apiClient'

export interface User {
  id: number
  name: string
  email: string
  rollNumber?: string
  branch?: string
}

export const fetchUsers = async () => {
  const res = await apiClient.get<User[]>('/api/users')
  return res.data
}

export const fetchUserByRollNumber = async (rollNumber: string) => {
  const res = await apiClient.get<User>(`/api/users/roll/${encodeURIComponent(rollNumber)}`)
  return res.data
}
