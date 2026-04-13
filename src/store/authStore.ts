import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { usersApi } from '../api/users'

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
  setFavorites: (ids: string[]) => void
}>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (shopId) => {
        const prev = get().favorites
        const next = prev.includes(shopId)
          ? prev.filter((id) => id !== shopId)
          : [...prev, shopId]
        set({ favorites: next })
        const userId = useAuthStore.getState().user?.id
        if (userId) {
          usersApi.update(userId, { favoriteShops: next }).catch(() => {
            set({ favorites: prev })
          })
        }
      },
      isFavorite: (shopId) => get().favorites.includes(shopId),
      setFavorites: (ids) => set({ favorites: ids }),
    }),
    { name: 'tuga-favorites' }
  )
)
