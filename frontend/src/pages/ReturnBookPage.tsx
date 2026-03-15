import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { fetchUserByRollNumber } from '../services/userApi'
import {
  fetchIssuedBookById,
  fetchIssuedBooksByUserId,
  returnBook,
} from '../services/issueApi'
import type { IssuedBook } from '../services/issueApi'

type Method = 'user' | 'id'

const ReturnBookPage = () => {
  const [method, setMethod] = useState<Method>('user')
  const [userId, setUserId] = useState<number | ''>('')
  const [rollNumber, setRollNumber] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{
    id: number
    name: string
    rollNumber?: string
    branch?: string
    email?: string
  } | null>(null)
  const [issueId, setIssueId] = useState<string>('')
  const [issued, setIssued] = useState<IssuedBook[]>([])
  const [selected, setSelected] = useState<IssuedBook | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  const handleLookupByRoll = async () => {
    const roll = rollNumber.trim().toUpperCase()
    if (!roll) {
      toast.error('Please enter a Roll Number.')
      return
    }
    try {
      setLookupLoading(true)
      const u = await fetchUserByRollNumber(roll)
      setSelectedUser(u)
      setUserId(u.id)
      setLookupError(null)
      const data = await fetchIssuedBooksByUserId(u.id)
      setIssued(data)
      setSelected(null)
      toast.success('Student found')
    } catch (err: any) {
      setSelectedUser(null)
      setUserId('')
      setIssued([])
      setSelected(null)
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

  useEffect(() => {
    if (method === 'user' && userId) {
      const load = async () => {
        const data = await fetchIssuedBooksByUserId(userId)
        setIssued(data)
        setSelected(null)
        setLookupError(null)
      }
      load()
    } else if (method === 'user' && !userId) {
      setIssued([])
      setSelected(null)
    }
  }, [method, userId])

  const handleLookupById = async () => {
    const id = Number(issueId)
    if (!id || isNaN(id)) {
      setLookupError('Please enter a valid Issue ID.')
      return
    }
    setLookupError(null)
    try {
      const record = await fetchIssuedBookById(id)
      if (record.status === 'RETURNED') {
        setLookupError('This book has already been returned.')
        setSelected(null)
      } else {
        setSelected(record)
      }
    } catch {
      setLookupError('Issue record not found.')
      setSelected(null)
    }
  }

  const isOverdue = (i: IssuedBook) => {
    if (!i.dueDate || i.status === 'RETURNED') return false
    return new Date(i.dueDate) < new Date()
  }

  const delayDays = (i: IssuedBook) => {
    if (!isOverdue(i)) return 0
    const due = new Date(i.dueDate!)
    const now = new Date()
    return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleReturn = async (e: FormEvent) => {
    e.preventDefault()
    const target = method === 'user' ? selected : selected
    if (!target) {
      toast.error('Please select an issue record to return.')
      return
    }
    try {
      setSubmitting(true)
      await returnBook({ issuedBookId: target.id })
      toast.success('Book returned successfully')
      setSelected(null)
      setIssueId('')
      if (method === 'user' && userId) {
        const data = await fetchIssuedBooksByUserId(userId)
        setIssued(data)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('Failed to return book')
    } finally {
      setSubmitting(false)
    }
  }

  const recordToReturn = method === 'user' ? selected : selected
  const user = recordToReturn?.user as { id?: number; name?: string } | undefined

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Return Book – MLRIT Library
        </h2>
        <p className="text-sm text-slate-500">
          Process returns by selecting a user or entering the official Issue ID
          from the MLRIT library receipt.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMethod('user')
              setUserId('')
              setRollNumber('')
              setSelectedUser(null)
              setIssued([])
              setSelected(null)
              setIssueId('')
              setLookupError(null)
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              method === 'user'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            By User
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('id')
              setSelected(null)
              setIssueId('')
              setLookupError(null)
              setRollNumber('')
              setSelectedUser(null)
              setUserId('')
              setIssued([])
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              method === 'id'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            By Issue ID
          </button>
        </div>

        {method === 'user' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select User (by Roll Number)
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value)
                    setSelectedUser(null)
                    setUserId('')
                    setIssued([])
                    setSelected(null)
                  }}
                  placeholder='Enter Roll Number (e.g. "22R21A05E5")'
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm uppercase outline-none ring-primary/30 focus:bg-white focus:ring"
                />
                <button
                  type="button"
                  onClick={handleLookupByRoll}
                  disabled={lookupLoading}
                  className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
                >
                  {lookupLoading ? 'Looking up...' : 'Lookup'}
                </button>
              </div>

              {selectedUser && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
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
            {userId && issued.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Book to Return
                </label>
                <div className="space-y-2 max-h-48 overflow-auto rounded-xl border border-slate-200 p-2">
                  {issued.map((i) => {
                    const overdue = isOverdue(i)
                    return (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                          selected?.id === i.id
                            ? 'border-primary bg-primary/5'
                            : overdue
                              ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-50'
                              : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-medium text-slate-800">
                          {i.book?.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>{i.book?.author}</span>
                          <span>•</span>
                          <span>
                            Issued {new Date(i.issueDate).toLocaleDateString()}
                          </span>
                          {overdue && (
                            <>
                              <span>•</span>
                              <span className="text-rose-600 font-medium">
                                {delayDays(i)} days overdue
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {userId && issued.length === 0 && (
              <p className="text-sm text-slate-500">
                No active issues for this user.
              </p>
            )}
          </div>
        )}

        {method === 'id' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Enter Issue ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={issueId}
                  onChange={(e) => {
                    setIssueId(e.target.value)
                    setLookupError(null)
                  }}
                  placeholder="e.g. 1"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                />
                <button
                  type="button"
                  onClick={handleLookupById}
                  className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Lookup
                </button>
              </div>
              {lookupError && (
                <p className="mt-1 text-sm text-rose-600">{lookupError}</p>
              )}
            </div>
            {selected && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p><strong>Book:</strong> {selected.book?.title}</p>
                <p><strong>Author:</strong> {selected.book?.author}</p>
                <p><strong>User:</strong> {user?.name}</p>
                <p><strong>Issue Date:</strong>{' '}
                  {new Date(selected.issueDate).toLocaleDateString()}
                </p>
                <p><strong>Due Date:</strong>{' '}
                  {selected.dueDate
                    ? new Date(selected.dueDate).toLocaleDateString()
                    : '-'}
                </p>
                {isOverdue(selected) && (
                  <p className="font-medium text-rose-600">
                    Overdue: {delayDays(selected)} days
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {recordToReturn && (
        <form
          onSubmit={handleReturn}
          className="rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Confirm Return
          </h3>
          <div className="mb-4 space-y-1 text-sm text-slate-600">
            <p><strong>Book:</strong> {recordToReturn.book?.title}</p>
            <p><strong>Author:</strong> {recordToReturn.book?.author}</p>
            <p><strong>User:</strong> {user?.name}</p>
            <p><strong>Issue ID:</strong> {recordToReturn.id}</p>
            {isOverdue(recordToReturn) && (
              <p className="text-rose-600 font-medium">
                Delay: {delayDays(recordToReturn)} days overdue
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? 'Processing...' : 'Confirm Return'}
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ReturnBookPage
