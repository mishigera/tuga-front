import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useFavoritesStore } from '../store/authStore'
import { useAddressStore } from '../store/addressStore'
import { usersApi } from '../api/users'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sub = params.get('sub')
    const name = params.get('name') ?? ''
    const email = params.get('email') ?? ''
    const picture = params.get('picture') ?? undefined
    const token = params.get('token') ?? undefined

    if (!sub) {
      navigate('/login?error=auth_failed', { replace: true })
      return
    }

    useAuthStore.getState().login({ id: sub, name, email, picture, token })

    usersApi.getById(sub)
      .then((user) => {
        if (user.favoriteShops) {
          useFavoritesStore.getState().setFavorites(user.favoriteShops)
        }
        if (user.addressSaved) {
          useAddressStore.getState().setAddresses(user.addressSaved)
        }
      })
      .catch(() => {})
      .finally(() => {
        navigate('/', { replace: true })
      })
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0E1014',
      color: '#9A9DA8',
      fontSize: 14,
    }}>
      Iniciando sesión...
    </div>
  )
}
