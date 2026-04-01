import { api } from './client'
import type { Product } from '../types'

export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  getByShop: async (shopId: string) => {
    const all = await api.get<Product[]>('/products')
    return all.filter((p) => {
      const shopRef = typeof p.shop === 'string' ? p.shop : p.shop._id
      return shopRef === shopId
    })
  },
  create: (data: { name: string; description: string; price: number; shop: string }) =>
    api.post<Product>('/products', data),
}
