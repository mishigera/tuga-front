import type { Address } from '../types'

// Mock en memoria
let mockAddresses: Address[] = []

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

// Cuando el backend esté listo, reemplazar cada función mock por:
// getAll:   api.get<Address[]>('/addresses')
// save:     api.post<Address>('/addresses', address)
// update:   api.put<Address>(`/addresses/${address.id}`, address)
// delete:   api.delete(`/addresses/${id}`)  — agregar api.delete al client si hace falta

export const addressService = {
  async getAll(): Promise<Address[]> {
    await delay()
    return [...mockAddresses]
  },

  async save(address: Omit<Address, 'id'>): Promise<Address> {
    await delay()
    const newAddress: Address = { ...address, id: crypto.randomUUID() }
    mockAddresses = [...mockAddresses, newAddress]
    return newAddress
  },

  async update(address: Address): Promise<Address> {
    await delay()
    mockAddresses = mockAddresses.map(a => (a.id === address.id ? address : a))
    return address
  },

  async delete(id: string): Promise<void> {
    await delay()
    mockAddresses = mockAddresses.filter(a => a.id !== id)
  },
}
