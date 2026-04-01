import { api } from './client'
import type { Shop } from '../types'

export const shopsApi = {
  getAll: () => api.get<Shop[]>('/shops'),
  getById: (id: string) => api.get<Shop>(`/shops/${id}`),
  create: (data: { name: string; description: string }) =>
    api.post<Shop>('/shops', data),
}
