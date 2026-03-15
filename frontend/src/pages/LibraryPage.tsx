import { useEffect, useState, useMemo } from 'react'
import { fetchAllBooks, searchBooks } from '../services/bookApi'
import type { Book } from '../types/library'
import BookCard from '../components/BookCard'
import LoadingSkeleton from '../components/LoadingSkeleton'

type SortKey = 'title' | 'author' | 'year' | 'quantity'
type SortDir = 'asc' | 'desc'

const LibraryPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('')
  const [sortKey, setSortKey] = useState<SortKey>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [searchDebounce, setSearchDebounce] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(search), 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = searchDebounce
          ? await searchBooks({
              title: searchDebounce,
              author: searchDebounce,
              isbn: searchDebounce,
            })
          : await fetchAllBooks()
        setBooks(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchDebounce])

  const categories = useMemo(() => {
    const set = new Set<string>()
    books.forEach((b) => set.add(b.category || 'Uncategorized'))
    return Array.from(set).sort()
  }, [books])

  const filtered = useMemo(() => {
    let list = [...books]
    if (categoryFilter) {
      list = list.filter(
        (b) => (b.category || 'Uncategorized') === categoryFilter
      )
    }
    if (availabilityFilter === 'available') {
      list = list.filter((b) => b.status === 'AVAILABLE' && b.quantity > 0)
    } else if (availabilityFilter === 'issued') {
      list = list.filter((b) => b.status === 'ISSUED' || b.quantity === 0)
    }
    list.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const aVal = av ?? ''
      const bVal = bv ?? ''
      const cmp =
        typeof aVal === 'string' && typeof bVal === 'string'
          ? aVal.localeCompare(bVal)
          : Number(aVal) - Number(bVal)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [books, categoryFilter, availabilityFilter, sortKey, sortDir])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            MLRIT Central Library Catalogue
          </h2>
          <p className="text-sm text-slate-500">
            Search, filter, and manage the institutional collection across all departments.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <input
          type="text"
          placeholder="Search by title, author, ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="issued">Issued</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Sort:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="year">Year</option>
            <option value="quantity">Quantity</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">
              No books found. Adjust your search or filters.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LibraryPage
