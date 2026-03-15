import { useEffect, useState } from 'react'
import { debounce } from '../util/debounce'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { searchBooks } from '../services/bookApi'
import type { Book } from '../types/library'

const SearchPage = () => {
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
  })
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const runSearch = debounce(async () => {
      setLoading(true)
      try {
        const data = await searchBooks(filters)
        setResults(data)
      } finally {
        setLoading(false)
      }
    }, 400)
    runSearch()
    return () => {
      runSearch.cancel()
    }
  }, [filters])

  const handleChange = (
    field: 'title' | 'author' | 'category' | 'isbn',
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Advanced Catalogue Search
        </h2>
        <p className="text-xs text-slate-500">
          Filter the MLRIT library holdings by title, author, category, or ISBN.
          Results update as you type.
        </p>
      </div>
      <SearchBar
        title={filters.title}
        author={filters.author}
        category={filters.category}
        isbn={filters.isbn}
        onChange={handleChange}
      />
      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          {results.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-sm ring-1 ring-slate-100">
              Start typing above to search for books in the catalogue.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchPage

