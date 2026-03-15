import { apiClient } from './apiClient'
import type { Book } from '../types/library'

export interface IssueBookPayload {
  bookId: number
  userId: number
}

export interface ReturnBookPayload {
  issuedBookId: number
}

export interface IssuedBookUser {
  id: number
  name: string
  email: string
  rollNumber?: string
}

export interface IssuedBook {
  id: number
  book: Book
  user?: IssuedBookUser
  issueDate: string
  dueDate?: string
  returnDate?: string
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE'
}

export const issueBook = async (payload: IssueBookPayload) => {
  const res = await apiClient.post<IssuedBook>('/api/books/issue', payload)
  return res.data
}

export const returnBook = async (payload: ReturnBookPayload) => {
  const res = await apiClient.post<IssuedBook>('/api/books/return', payload)
  return res.data
}

export const fetchActiveIssuedBooks = async () => {
  const res = await apiClient.get<IssuedBook[]>('/api/books/issued')
  return res.data
}

export const fetchAllIssuedBooks = async () => {
  const res = await apiClient.get<IssuedBook[]>('/api/issued')
  return res.data
}

export const fetchIssuedBookById = async (id: number) => {
  const res = await apiClient.get<IssuedBook>(`/api/issued/${id}`)
  return res.data
}

export const fetchIssuedBooksByUserId = async (userId: number) => {
  const res = await apiClient.get<IssuedBook[]>(`/api/issued/by-user/${userId}`)
  return res.data
}

export const fetchMyIssuedBooks = async () => {
  const res = await apiClient.get<IssuedBook[]>('/api/issued/me')
  return res.data
}

