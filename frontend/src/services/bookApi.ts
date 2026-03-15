import { apiClient } from './apiClient'
import type { Book } from '../types/library'

export interface AddBookPayload {
  title: string
  author: string
  category?: string
  isbn: string
  publisher?: string
  quantity: number
  year?: number
  description?: string
}

export const fetchAllBooks = async () => {
  const res = await apiClient.get<Book[]>('/api/books')
  return res.data
}

export const fetchAvailableBooks = async () => {
  const res = await apiClient.get<Book[]>('/api/books/available')
  return res.data
}

export const searchBooks = async (params: {
  title?: string
  author?: string
  category?: string
  isbn?: string
  q?: string
}) => {
  const res = await apiClient.get<Book[]>('/api/books/search', { params })
  return res.data
}

export const addBook = async (payload: AddBookPayload) => {
  const res = await apiClient.post<Book>('/api/books', payload)
  return res.data
}

