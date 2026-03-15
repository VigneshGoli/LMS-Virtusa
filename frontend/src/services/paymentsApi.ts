import { apiClient } from './apiClient'

export interface DuesSummary {
  totalFine: number
  totalPaid: number
  outstanding: number
  status: 'PAID' | 'PENDING'
}

export interface PaymentRecordResponse extends DuesSummary {
  paymentId: number
  referenceId: string
  timestamp: string
}

export const fetchMyDues = async () => {
  const res = await apiClient.get<DuesSummary>('/api/payments/dues/me')
  return res.data
}

export const recordPayment = async (amount: number, referenceId: string) => {
  const res = await apiClient.post<PaymentRecordResponse>('/api/payments/record', {
    amount,
    referenceId,
  })
  return res.data
}

