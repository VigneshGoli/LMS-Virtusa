import { useState, useEffect, useMemo, useCallback } from 'react'
import { searchBooks, fetchAvailableBooks } from '../services/bookApi'
import type { Book } from '../types/library'

interface SearchableBookSelectorProps {
  value: number | ''
  onChange: (bookId: number | '') => void
  placeholder?: string
}

const SearchableBookSelector = ({
  onChange,
  placeholder = 'Search by title, author, or ISBN...',
}: SearchableBookSelectorProps) => {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const availableBooks = useMemo(
    () => books.filter((b) => b.quantity > 0),
    [books]
  )

  const loadInitial = useCallback(async () => {
    setLoading(true)
    const data = await fetchAvailableBooks()
    setBooks(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      void loadInitial()
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await searchBooks({ q: query.trim() })
      setBooks(data)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, loadInitial])

  const displayValue = selectedBook
    ? `${selectedBook.title} — ${selectedBook.author} (${selectedBook.quantity} available)`
    : query || ''

  const handleSelect = (book: Book) => {
    setSelectedBook(book)
    onChange(book.id)
    setQuery('')
    setOpen(false)
  }

  const handleClear = () => {
    setSelectedBook(null)
    onChange('')
    setQuery('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    if (!e.target.value) {
      setSelectedBook(null)
      onChange('')
    }
  }

  const listToShow = query ? books : availableBooks.slice(0, 50)
  const showResults = open && (query || books.length > 0)

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={selectedBook ? displayValue : query}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
            readOnly={!!selectedBook}
          />
          {selectedBook && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-100">
          {loading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Searching...</div>
          ) : listToShow.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">
              No books found.
            </div>
          ) : (
            <ul className="py-2">
              {listToShow.map((b) => {
                const canIssue = b.quantity > 0
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        if (canIssue) handleSelect(b)
                      }}
                      disabled={!canIssue}
                      className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 ${
                        canIssue ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="font-medium text-slate-800">{b.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{b.author}</span>
                        <span>•</span>
                        <span
                          className={
                            canIssue ? 'text-emerald-600' : 'text-rose-600'
                          }
                        >
                          {canIssue
                            ? `${b.quantity} available`
                            : 'No copies available'}
                        </span>
                        {b.category && (
                          <>
                            <span>•</span>
                            <span>{b.category}</span>
                          </>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableBookSelector
