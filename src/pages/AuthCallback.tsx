import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (!token) {
      navigate('/login?error=no_token', { replace: true })
      return
    }

    try {
      // Decode JWT payload (base64url)
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(base64))

      // Persist to store synchronously before navigating
      useAuthStore.getState().login({
        id: payload.sub,
        name: payload.name ?? '',
        email: payload.email ?? '',
        picture: payload.picture,
        accessToken: token,
      })

      // Small delay to ensure Zustand persist middleware flushes to localStorage
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 100)
    } catch (e) {
      console.error('AuthCallback error:', e)
      navigate('/login?error=invalid_token', { replace: true })
    }
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
