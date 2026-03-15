import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { addBook } from '../services/bookApi'

const AddBookPage = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    publisher: '',
    quantity: 1,
    year: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.author || !form.isbn) {
      toast.error('Title, Author and ISBN are required.')
      return
    }
    try {
      setSubmitting(true)
      await addBook({
        title: form.title,
        author: form.author,
        category: form.category || undefined,
        isbn: form.isbn,
        publisher: form.publisher || undefined,
        quantity: form.quantity,
        year: form.year ? Number(form.year) : undefined,
        description: form.description || undefined,
      })
      toast.success('Book added successfully')
      setForm({
        title: '',
        author: '',
        category: '',
        isbn: '',
        publisher: '',
        quantity: 1,
        year: '',
        description: '',
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('Failed to add book')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Add New Title to MLRIT Collection
        </h2>
        <p className="text-xs text-slate-500">
          Capture complete bibliographic details for inclusion in the institutional catalogue.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Author
            </label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">ISBN</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Publisher
            </label>
            <input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              min={0}
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-primary/30 focus:bg-white focus:ring"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save Book'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBookPage

