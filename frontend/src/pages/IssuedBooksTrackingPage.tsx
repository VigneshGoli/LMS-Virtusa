import { useEffect, useState, useMemo } from 'react'
import { fetchAllIssuedBooks } from '../services/issueApi'
import type { IssuedBook } from '../services/issueApi'
import LoadingSkeleton from '../components/LoadingSkeleton'

type SortKey = 'id' | 'title' | 'author' | 'userName' | 'issueDate' | 'dueDate' | 'status'
type SortDir = 'asc' | 'desc'

const statusLabel: Record<string, string> = {
  ACTIVE: 'Active',
  RETURNED: 'Returned',
  OVERDUE: 'Overdue',
}

const IssuedBooksTrackingPage = () => {
  const [issued, setIssued] = useState<IssuedBook[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sortKey, setSortKey] = useState<SortKey>('issueDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const load = async () => {
    setLoading(true)
    const data = await fetchAllIssuedBooks()
    setIssued(data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    let list = [...issued]
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (i) =>
          String(i.id).includes(q) ||
          i.book?.title?.toLowerCase().includes(q) ||
          i.book?.author?.toLowerCase().includes(q) ||
          i.book?.isbn?.toLowerCase().includes(q) ||
          (i.user as { name?: string })?.name?.toLowerCase().includes(q) ||
          (i.user as { email?: string })?.email?.toLowerCase().includes(q)
      )
    }
    if (statusFilter) {
      list = list.filter((i) => i.status === statusFilter)
    }
    list.sort((a, b) => {
      const av = a[sortKey as keyof IssuedBook]
      const bv = b[sortKey as keyof IssuedBook]
      if (sortKey === 'title' || sortKey === 'author') {
        const aStr =
          ((a.book as unknown as Record<string, string>)?.[sortKey] as string) ??
          ''
        const bStr =
          ((b.book as unknown as Record<string, string>)?.[sortKey] as string) ??
          ''
        return sortDir === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      }
      if (sortKey === 'userName') {
        const aName = (a.user as { name?: string })?.name ?? ''
        const bName = (b.user as { name?: string })?.name ?? ''
        return sortDir === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName)
      }
      if (sortKey === 'issueDate' || sortKey === 'dueDate') {
        const aDate = (av as string) ?? ''
        const bDate = (bv as string) ?? ''
        return sortDir === 'asc'
          ? aDate.localeCompare(bDate)
          : bDate.localeCompare(aDate)
      }
      if (sortKey === 'id' || sortKey === 'status') {
        const aVal = String(av ?? '')
        const bVal = String(bv ?? '')
        return sortDir === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return 0
    })
    return list
  }, [issued, search, statusFilter, sortKey, sortDir])

  const isOverdue = (i: IssuedBook) => {
    if (i.status !== 'ACTIVE') return false
    if (!i.dueDate) return false
    return new Date(i.dueDate) < new Date()
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else setSortKey(key)
  }

  if (loading) return <LoadingSkeleton rows={6} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Issued Books Register – MLRIT
          </h2>
          <p className="text-sm text-slate-500">
            Track all active, returned, and overdue issues across the
            institution with search, filters, and sortable columns.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <input
          type="text"
          placeholder="Search by ID, title, author, ISBN, user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="RETURNED">Returned</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('id')}
                >
                  Issue ID {sortKey === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('title')}
                >
                  Book {sortKey === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('author')}
                >
                  Author {sortKey === 'author' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 font-semibold">Roll Number</th>
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('userName')}
                >
                  User {sortKey === 'userName' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('issueDate')}
                >
                  Issue Date {sortKey === 'issueDate' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date {sortKey === 'dueDate' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 font-semibold">Return Date</th>
                <th
                  className="cursor-pointer px-4 py-3 font-semibold hover:bg-slate-100"
                  onClick={() => handleSort('status')}
                >
                  Status {sortKey === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const overdue = isOverdue(i)
                const user = i.user as { id?: number; name?: string; rollNumber?: string } | undefined
                return (
                  <tr
                    key={i.id}
                    className={`border-t border-slate-100 hover:bg-slate-50 ${
                      overdue ? 'bg-rose-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{i.id}</td>
                    <td className="px-4 py-3 text-slate-700">{i.book?.title}</td>
                    <td className="px-4 py-3 text-slate-600">{i.book?.author}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {user?.rollNumber ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {i.issueDate
                        ? new Date(i.issueDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className={`px-4 py-3 ${overdue ? 'font-medium text-rose-600' : 'text-slate-600'}`}>
                      {i.dueDate
                        ? new Date(i.dueDate).toLocaleDateString()
                        : '-'}
                      {overdue && ' (Overdue)'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {i.returnDate
                        ? new Date(i.returnDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${
                          i.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-800'
                            : i.status === 'RETURNED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : overdue
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {statusLabel[i.status] ?? i.status}
                        {overdue && ' (Overdue)'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-slate-500">
            No issued records found.
          </div>
        )}
      </div>
    </div>
  )
}

export default IssuedBooksTrackingPage
