import { api } from './client'
import type { Order, CreateOrderPayload } from '../types'

export const ordersApi = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  create: (data: CreateOrderPayload) => api.post<Order>('/orders', data),
}
