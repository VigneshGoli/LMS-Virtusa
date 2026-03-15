import { useEffect, useState } from 'react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { fetchMyIssuedBooks } from '../services/issueApi'
import type { IssuedBook } from '../services/issueApi'
import { fetchMyDues, recordPayment } from '../services/paymentsApi'
import toast from 'react-hot-toast'

const MyIssuedBooksPage = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<IssuedBook[]>([])
  const [duesLoading, setDuesLoading] = useState(true)
  const [dues, setDues] = useState<{
    totalFine: number
    totalPaid: number
    outstanding: number
    status: 'PAID' | 'PENDING'
  } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyIssuedBooks()
        setItems(data)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    const loadDues = async () => {
      try {
        const data = await fetchMyDues()
        setDues(data)
      } catch {
        toast.error('Unable to load library dues.')
      } finally {
        setDuesLoading(false)
      }
    }
    void loadDues()
  }, [])

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handlePayNow = async () => {
    if (!dues || dues.outstanding <= 0) return
    setProcessingPayment(true)

    const ok = await loadRazorpayScript()
    if (!ok) {
      toast.error('Unable to load payment gateway. Please try again.')
      setProcessingPayment(false)
      return
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SQHjbYb1oYScbf'
    const amountPaise = Math.round(dues.outstanding * 100)

    const options: any = {
      key,
      amount: amountPaise,
      currency: 'INR',
      name: 'MLRIT Library',
      description: 'Library dues payment',
      theme: {
        color: '#f58025',
      },
      handler: async (response: any) => {
        try {
          const refId = response.razorpay_payment_id ?? 'TEST_PAYMENT'
          const updated = await recordPayment(dues.outstanding, refId)
          setDues({
            totalFine: updated.totalFine,
            totalPaid: updated.totalPaid,
            outstanding: updated.outstanding,
            status: updated.status,
          })
          toast.success('Payment successful. Your library dues have been cleared.')
        } catch {
          toast.error('Payment captured, but failed to update dues. Please contact library staff.')
        } finally {
          setProcessingPayment(false)
          setShowConfirm(false)
        }
      },
      modal: {
        ondismiss: () => {
          setProcessingPayment(false)
        },
      },
      prefill: {},
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  if (loading || duesLoading) return <LoadingSkeleton rows={6} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">My Issued Books</h2>
          <p className="text-sm text-slate-500">
            View books issued to your account and track your library dues in real-time.
          </p>
        </div>

        {dues && (
          <div
            className={`w-full max-w-xs rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition
            ${dues.outstanding > 0
              ? 'border-amber-200 from-amber-50 to-orange-50'
              : 'border-emerald-200 from-emerald-50 to-emerald-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Library Dues
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  ₹{dues.outstanding.toFixed(0)}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${dues.outstanding > 0
                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
                  : 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                }`}
              >
                <span
                  className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                    dues.outstanding > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                {dues.outstanding > 0 ? 'Pending' : 'Paid'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              You are allowed 15 days per book. A fine of ₹1 per day applies after the due date.
            </p>
            <button
              type="button"
              disabled={dues.outstanding <= 0 || processingPayment}
              onClick={() => setShowConfirm(true)}
              className={`mt-3 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-medium
              transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
              ${
                dues.outstanding > 0
                  ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300'
                  : 'cursor-default bg-slate-100 text-slate-400 shadow-none'
              }`}
            >
              {dues.outstanding > 0 ? (processingPayment ? 'Processing...' : 'Pay Now') : 'No Dues'}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-4 py-3 font-semibold">Book</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Issue Date</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const overdue =
                  i.status === 'ACTIVE' && i.dueDate
                    ? new Date(i.dueDate) < new Date()
                    : false
                return (
                  <tr
                    key={i.id}
                    className={`border-t border-slate-100 hover:bg-slate-50 ${
                      overdue ? 'bg-rose-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {i.book?.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{i.book?.author}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(i.issueDate).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-3 ${overdue ? 'font-medium text-rose-600' : 'text-slate-600'}`}>
                      {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '-'}
                      {overdue && ' (Overdue)'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${
                          i.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-800'
                            : i.status === 'RETURNED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {i.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-slate-500">
            No issued books found for your account.
          </div>
        )}
      </div>

      {showConfirm && dues && dues.outstanding > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Confirm Payment</h3>
            <p className="mt-2 text-sm text-slate-600">
              You are about to pay your outstanding library dues.
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Total Due Amount</span>
                <span className="font-semibold text-slate-900">₹{dues.outstanding.toFixed(0)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Fines are calculated at ₹1 per day per book after the 15-day borrowing period.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => !processingPayment && setShowConfirm(false)}
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:bg-primary-300"
                onClick={handlePayNow}
                disabled={processingPayment}
              >
                {processingPayment ? 'Processing...' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyIssuedBooksPage

