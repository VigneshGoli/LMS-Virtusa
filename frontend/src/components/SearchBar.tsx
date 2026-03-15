interface SearchBarProps {
  title: string
  author: string
  category: string
  isbn: string
  onChange: (field: 'title' | 'author' | 'category' | 'isbn', value: string) => void
}

const SearchBar = ({
  title,
  author,
  category,
  isbn,
  onChange,
}: SearchBarProps) => {
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:grid-cols-4">
      <input
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
        placeholder="Title"
        value={title}
        onChange={(e) => onChange('title', e.target.value)}
      />
      <input
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
        placeholder="Author"
        value={author}
        onChange={(e) => onChange('author', e.target.value)}
      />
      <input
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
        placeholder="Category"
        value={category}
        onChange={(e) => onChange('category', e.target.value)}
      />
      <input
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
        placeholder="ISBN"
        value={isbn}
        onChange={(e) => onChange('isbn', e.target.value)}
      />
    </div>
  )
}

export default SearchBar

