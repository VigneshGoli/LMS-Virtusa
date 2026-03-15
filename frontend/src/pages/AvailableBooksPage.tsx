import { useEffect, useState } from 'react'
import { fetchAvailableBooks } from '../services/bookApi'
import type { Book } from '../types/library'
import BookCard from '../components/BookCard'
import LoadingSkeleton from '../components/LoadingSkeleton'

const AvailableBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAvailableBooks()
        setBooks(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Titles Currently Available for Issue
        </h2>
        <p className="text-xs text-slate-500">
          View only the books that are presently available in the MLRIT Central Library.
        </p>
      </div>
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          {books.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-sm ring-1 ring-slate-100">
              No books are currently available.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AvailableBooksPage

