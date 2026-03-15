import { useEffect, useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchActivityLogs, fetchDashboardStats } from '../services/dashboardApi'
import { fetchAllBooks } from '../services/bookApi'
import { fetchAllIssuedBooks } from '../services/issueApi'
import StatsCard from '../components/StatsCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import type { ActivityLog, DashboardStats } from '../types/library'
import type { Book } from '../types/library'

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [issued, setIssued] = useState<{ book?: { title?: string } }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a, b, i] = await Promise.all([
          fetchDashboardStats(),
          fetchActivityLogs(),
          fetchAllBooks(),
          fetchAllIssuedBooks(),
        ])
        setStats(s)
        setActivity(a.slice(-10).reverse())
        setBooks(b)
        setIssued(i)
      } catch {
        setStats({
          totalBooks: 0,
          issuedBooks: 0,
          availableBooks: 0,
          overdueBooks: 0,
          totalUsers: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    books.forEach((b) => {
      const cat = b.category || 'Uncategorized'
      map.set(cat, (map.get(cat) ?? 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [books])

  const mostBorrowed = useMemo(() => {
    const map = new Map<string, number>()
    issued.forEach((i) => {
      const title = i.book?.title ?? 'Unknown'
      map.set(title, (map.get(title) ?? 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [issued])

  const activityDisplay = useMemo(() => {
    return activity.map((log) => ({
      ...log,
      label:
        log.action === 'BOOK_ISSUED'
          ? 'Book issued'
          : log.action === 'BOOK_RETURNED'
            ? 'Book returned'
            : log.action === 'OVERDUE_CHECK'
              ? 'Overdue check'
              : log.action.replace(/_/g, ' '),
    }))
  }, [activity])

  if (loading || !stats) {
    return <LoadingSkeleton rows={6} />
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          MLRIT Library Analytics
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          At-a-glance view of circulation, collection health, and recent
          institutional library activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          label="Total Books"
          value={stats.totalBooks}
          accentClass="bg-primary"
        />
        <StatsCard
          label="Available"
          value={stats.availableBooks}
          accentClass="bg-emerald-500"
        />
        <StatsCard
          label="Issued"
          value={stats.issuedBooks}
          accentClass="bg-amber-500"
        />
        <StatsCard
          label="Overdue"
          value={stats.overdueBooks}
          accentClass="bg-rose-500"
        />
        <StatsCard
          label="Users"
          value={stats.totalUsers ?? 0}
          accentClass="bg-indigo-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Books by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    fontSize={11}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <Bar dataKey="value" fill="#f58025" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No category data yet.</p>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Most Borrowed
          </h3>
          {mostBorrowed.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostBorrowed} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    fontSize={11}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <Bar dataKey="count" fill="#009444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No issue data yet.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Recent Activity
          </h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {activityDisplay.length === 0 && (
              <p className="text-sm text-slate-500">No recent activity.</p>
            )}
            {activityDisplay.map((log) => (
              <div
                key={`${log.timestamp}-${log.action}`}
                className="flex items-start justify-between rounded-xl bg-slate-50 px-4 py-3 hover:bg-slate-100/80"
              >
                <div>
                  <span className="font-medium text-slate-700">{log.label}</span>
                  <p className="mt-0.5 text-xs text-slate-500">{log.details}</p>
                </div>
                <span className="ml-3 shrink-0 text-xs text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-slate-100 shadow-lg">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            System Status
          </h3>
          <p className="mt-2 text-sm font-semibold">
            Online Library Platform
          </p>
          <p className="mt-2 text-xs text-slate-400">
            All core services are operational. Background schedulers are
            monitoring overdue books and audit logs are being persisted.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
