import { useRef } from 'react'
import { jsPDF } from 'jspdf'
import type { IssuedBook } from '../services/issueApi'

interface IssueReceiptProps {
  record: IssuedBook
  onClose: () => void
}

function buildReceiptPdf(record: IssuedBook): jsPDF {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 20
  let y = 20

  const user = record.user as { id?: number; name?: string; email?: string; rollNumber?: string } | undefined
  const dueDate = record.dueDate ? new Date(record.dueDate).toLocaleDateString() : '-'
  const issueDateTime = record.issueDate
    ? new Date(record.issueDate).toLocaleString()
    : '-'

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('MLRIT Library Management System', pageW / 2, y, { align: 'center' })
  y += 8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('MLRIT Library', pageW / 2, y, { align: 'center' })
  y += 10

  doc.setDrawColor(180, 180, 180)
  doc.line(margin, y, pageW - margin, y)
  y += 12

  // Title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('BOOK ISSUE RECEIPT', pageW / 2, y, { align: 'center' })
  y += 12

  // Details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const detailRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value || '-', margin + 45, y)
    y += 7
  }

  detailRow('Issue ID', String(record.id))
  detailRow('Date & Time', issueDateTime)
  detailRow('Book Title', record.book?.title ?? '')
  detailRow('Author', record.book?.author ?? '')
  detailRow('ISBN', record.book?.isbn ?? '')
  detailRow('Roll Number', user?.rollNumber ?? '-')
  detailRow('User Name', user?.name ?? '-')
  detailRow('Due Date', dueDate)

  y += 8
  doc.setDrawColor(180, 180, 180)
  doc.line(margin, y, pageW - margin, y)
  y += 10

  // Declaration
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Declaration', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  const declaration =
    'I acknowledge receiving this book and agree to return it within 15 days. ' +
    'Failure to return the book within the due date may result in being liable to pay the full value of the book.'
  const lines = doc.splitTextToSize(declaration, pageW - 2 * margin)
  doc.text(lines, margin, y)
  y += lines.length * 6 + 14

  // Signing section
  const col1 = margin
  const col2 = pageW / 2 + 10
  const lineY = y + 20
  const lineW = (pageW - 2 * margin - 20) / 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Issuer:', col1, y)
  doc.text('Receiver:', col2, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('(Authorized Signature)', col1, y)
  doc.text('(User Signature)', col2, y)
  y += 12

  doc.setDrawColor(60, 60, 60)
  doc.line(col1, lineY, col1 + lineW, lineY)
  doc.line(col2, lineY, col2 + lineW, lineY)

  return doc
}

const IssueReceipt = ({ record, onClose }: IssueReceiptProps) => {
  const printRef = useRef<HTMLDivElement>(null)

  const user = record.user as { id?: number; name?: string; rollNumber?: string } | undefined

  const handleDownload = () => {
    const doc = buildReceiptPdf(record)
    doc.save(`issue-receipt-${record.id}.pdf`)
  }

  const handlePrint = () => {
    const doc = buildReceiptPdf(record)
    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url, '_blank')
    if (printWindow) {
      printWindow.onafterprint = () => {
        printWindow.close()
        URL.revokeObjectURL(url)
      }
      setTimeout(() => {
        try {
          if (!printWindow.closed) printWindow.print()
        } catch {
          printWindow.close()
          URL.revokeObjectURL(url)
        }
      }, 400)
    } else {
      URL.revokeObjectURL(url)
      doc.save(`issue-receipt-${record.id}.pdf`)
    }
  }

  const dueDate = record.dueDate
    ? new Date(record.dueDate).toLocaleDateString()
    : ''
  const issueDateTime = record.issueDate
    ? new Date(record.issueDate).toLocaleString()
    : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Issue Receipt</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        <div ref={printRef} className="p-6 space-y-4 text-sm">
          <div className="text-center border-b border-slate-200 pb-4">
            <div className="text-xl font-bold text-slate-900">
              MLRIT Library Management System
            </div>
            <div className="text-xs text-slate-500 mt-1">
              MLRIT Library
            </div>
          </div>
          <div className="space-y-2 text-slate-700">
            <p><strong>Issue ID:</strong> {record.id}</p>
            <p><strong>Date & Time:</strong> {issueDateTime}</p>
            <p><strong>Book Title:</strong> {record.book?.title}</p>
            <p><strong>Author:</strong> {record.book?.author}</p>
            <p><strong>ISBN:</strong> {record.book?.isbn}</p>
            <p><strong>Roll Number:</strong> {user?.rollNumber ?? '-'}</p>
            <p><strong>User Name:</strong> {user?.name ?? '-'}</p>
            <p><strong>Due Date:</strong> {dueDate}</p>
          </div>
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-2">
            <p className="font-semibold">Declaration:</p>
            <p>
              I acknowledge receiving this book and agree to return it within 15
              days. Failure to return the book within the due date may result in
              being liable to pay the full value of the book.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="font-semibold text-slate-700">Issuer:</p>
                <div className="mt-8 border-b border-slate-300" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Receiver:</p>
                <div className="mt-8 border-b border-slate-300" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Print Receipt
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default IssueReceipt
