import { apiClient } from './apiClient'
import type { ActivityLog, DashboardStats } from '../types/library'

export const fetchDashboardStats = async () => {
  const res = await apiClient.get<DashboardStats>('/api/dashboard/stats')
  return res.data
}

export const fetchActivityLogs = async () => {
  const res = await apiClient.get<ActivityLog[]>('/api/dashboard/activity')
  return res.data
}

