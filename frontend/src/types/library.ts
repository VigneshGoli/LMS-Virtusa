export type BookStatus = 'AVAILABLE' | 'ISSUED'

export interface Book {
  id: number
  title: string
  author: string
  category?: string
  isbn: string
  publisher?: string
  quantity: number
  year?: number
  description?: string
  status: BookStatus
}

export interface DashboardStats {
  totalBooks: number
  issuedBooks: number
  availableBooks: number
  overdueBooks: number
  totalUsers?: number
}

export interface ActivityLog {
  timestamp: string
  action: string
  details: string
}

