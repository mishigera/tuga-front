import { api } from './client'
import type { User, UserShop } from '../types'

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: { name: string; email: string; password: string }) =>
    api.post<User>('/users', data),
  update: (id: string, data: { favoriteShops: string[] }) =>
    api.put<User>(`/users/${id}`, data),
}

export const userShopsApi = {
  login: (data: { userName: string; password: string }) =>
    api.post<{ success: boolean; userShop?: UserShop }>('/userShops/login', data),
  create: (data: { userName: string; password: string; role: string; shop: string }) =>
    api.post<UserShop>('/userShops', data),
  getByUserId: (userId: string) => api.get<UserShop>(`/userShops/${userId}`),
}
