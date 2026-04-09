import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SavedAddress } from '../types'
import { usersApi } from '../api/users'
import { useAuthStore } from './authStore'

interface AddressState {
  addresses: SavedAddress[]
  setAddresses: (addresses: SavedAddress[]) => void
  addAddress: (address: SavedAddress) => void
  removeAddress: (name: string) => void
  setFavorite: (name: string) => void
  getFavorite: () => SavedAddress | undefined
}


export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],

      setAddresses: (addresses) => set({ addresses }),

      addAddress: (address) => {
        const prev = get().addresses
        const next = [...prev, address]
        set({ addresses: next })
        const sub = useAuthStore.getState().user?.id
        if (sub) {
          usersApi.update(sub, { addressSaved: next }).catch(() => {
            set({ addresses: prev })
          })
        }
      },

      removeAddress: (name) => {
        const prev = get().addresses
        const next = prev.filter((a) => a.name !== name)
        set({ addresses: next })
        const sub = useAuthStore.getState().user?.id
        if (sub) {
          usersApi.update(sub, { addressSaved: next }).catch(() => {
            set({ addresses: prev })
          })
        }
      },

      setFavorite: (name) => {
        const prev = get().addresses
        const next = prev.map((a) => ({ ...a, favorite: a.name === name }))
        set({ addresses: next })
        const sub = useAuthStore.getState().user?.id
        if (sub) {
          usersApi.update(sub, { addressSaved: next }).catch(() => {
            set({ addresses: prev })
          })
        }
      },

      getFavorite: () => get().addresses.find((a) => a.favorite),
    }),
    { name: 'tuga-addresses' }
  )
)
