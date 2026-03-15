import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { fetchUserByRollNumber } from '../services/userApi'
import { issueBook } from '../services/issueApi'
import type { IssuedBook } from '../services/issueApi'
import SearchableBookSelector from '../components/SearchableBookSelector'
import IssueReceipt from '../components/IssueReceipt'

const IssueBookPage = () => {
  const [bookId, setBookId] = useState<number | ''>('')
  const [rollNumber, setRollNumber] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{
    id: number
    name: string
    rollNumber?: string
    branch?: string
    email?: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [lastIssued, setLastIssued] = useState<IssuedBook | null>(null)

  const handleLookup = async () => {
    const roll = rollNumber.trim().toUpperCase()
    if (!roll) {
      toast.error('Please enter a Roll Number.')
      return
    }
    try {
      setLookupLoading(true)
      const u = await fetchUserByRollNumber(roll)
      setSelectedUser(u)
      toast.success('Student found')
    } catch (err: any) {
      setSelectedUser(null)
      const status = err?.response?.status
      if (status === 404) {
        toast.error('Student not found for this Roll Number')
      } else if (status === 403) {
        toast.error('You are not authorised to lookup students.')
      } else {
        toast.error('Unable to lookup student. Please try again.')
      }
    } finally {
      setLookupLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!bookId || !selectedUser?.id) {
      toast.error('Please select a book and lookup a student by Roll Number.')
      return
    }
    try {
      setSubmitting(true)
      const record = await issueBook({ bookId, userId: selectedUser.id })
      setLastIssued(record)
      toast.success('Book issued successfully')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('Failed to issue book')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReceiptClose = () => {
    setLastIssued(null)
    setBookId('')
    setRollNumber('')
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Issue Book – MLRIT Library
        </h2>
        <p className="text-sm text-slate-500">
          Search for a book, select a registered student or staff member, and
          record the official issue transaction.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Search & Select Book
          </label>
          <SearchableBookSelector
            value={bookId}
            onChange={setBookId}
            placeholder="Search by title, author, or ISBN..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Select User (by Roll Number)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => {
                setRollNumber(e.target.value)
                setSelectedUser(null)
              }}
              placeholder='Enter Roll Number (e.g. "22R21A05E5")'
              className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm uppercase outline-none ring-primary/30 focus:bg-white focus:ring"
            />
            <button
              type="button"
              onClick={handleLookup}
              disabled={lookupLoading}
              className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {lookupLoading ? 'Looking up...' : 'Lookup'}
            </button>
          </div>

          {selectedUser && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {selectedUser.rollNumber ?? rollNumber.trim().toUpperCase()}
                </span>
                {selectedUser.branch && (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                    {selectedUser.branch}
                  </span>
                )}
              </div>
              <div className="mt-2 font-medium text-slate-800">
                {selectedUser.name}
              </div>
              {selectedUser.email && (
                <div className="mt-1 text-xs text-slate-500">
                  {selectedUser.email}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? 'Issuing...' : 'Issue Book'}
          </button>
        </div>
      </form>

      {lastIssued && (
        <IssueReceipt record={lastIssued} onClose={handleReceiptClose} />
      )}
    </div>
  )
}

export default IssueBookPage
