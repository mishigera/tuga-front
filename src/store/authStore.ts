import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id: string
  name: string
  email: string
  picture?: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'tuga-auth',
    }
  )
)

export const useFavoritesStore = create<{
  favorites: string[]
  toggle: (shopId: string) => void
  isFavorite: (shopId: string) => boolean
}>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (shopId) =>
        set((state) => ({
          favorites: state.favorites.includes(shopId)
            ? state.favorites.filter((id) => id !== shopId)
            : [...state.favorites, shopId],
        })),
      isFavorite: (shopId) => get().favorites.includes(shopId),
    }),
    { name: 'tuga-favorites' }
  )
)
