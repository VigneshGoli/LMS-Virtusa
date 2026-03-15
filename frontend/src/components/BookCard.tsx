import type { Book } from '../types/library'

interface BookCardProps {
  book: Book
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{book.author}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            book.status === 'AVAILABLE'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {book.status === 'AVAILABLE' ? 'Available' : 'Issued'}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
        {book.category && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {book.category}
          </span>
        )}
        <span className="rounded-full bg-slate-100 px-2 py-0.5">
          ISBN: {book.isbn}
        </span>
        {book.publisher && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {book.publisher}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <span className="font-medium">
          {book.quantity > 0 ? (
            <span className="text-emerald-600">{book.quantity} available</span>
          ) : (
            <span className="text-amber-600">No copies</span>
          )}
        </span>
        {book.year && <span>{book.year}</span>}
      </div>
    </div>
  )
}

export default BookCard

