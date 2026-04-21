import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { useAuthStore, useFavoritesStore } from '../store/authStore'
import { useAddressStore } from '../store/addressStore'
import { usersApi } from '../api/users'

export function useDeepLinkAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = CapApp.addListener('appUrlOpen', async (event) => {
      const url = new URL(event.url)

      if (url.host !== 'auth' || url.pathname !== '/callback') return

      try { await Browser.close() } catch { /* may already be closed */ }

      const sub = url.searchParams.get('sub')
      const name = url.searchParams.get('name') ?? ''
      const email = url.searchParams.get('email') ?? ''
      const picture = url.searchParams.get('picture') ?? undefined
      const token = url.searchParams.get('token') ?? undefined

      if (!sub) {
        navigate('/login?error=auth_failed', { replace: true })
        return
      }

      useAuthStore.getState().login({ id: sub, name, email, picture, token })

      try {
        const user = await usersApi.getById(sub)
        if (user.favoriteShops) {
          useFavoritesStore.getState().setFavorites(user.favoriteShops)
        }
        if (user.addressSaved) {
          useAddressStore.getState().setAddresses(user.addressSaved)
        }
      } catch {
        // Proceed even if profile fetch fails
      }

      navigate('/', { replace: true })
    })

    return () => {
      listener.then(h => h.remove())
    }
  }, [navigate])
}
