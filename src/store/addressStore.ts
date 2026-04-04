import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address } from '../types'

interface AddressState {
  addresses: Address[]
  setAddresses: (addresses: Address[]) => void
  addAddress: (address: Address) => void
  removeAddress: (id: string) => void
  setDefault: (id: string) => void
  getDefault: () => Address | undefined
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],

      setAddresses: (addresses) => set({ addresses }),

      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      setDefault: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),

      getDefault: () => get().addresses.find((a) => a.isDefault),
    }),
    {
      name: 'tuga-addresses',
    }
  )
)
