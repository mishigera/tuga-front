import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sub = params.get('sub')
    const name = params.get('name') ?? ''
    const email = params.get('email') ?? ''
    const picture = params.get('picture') ?? undefined

    if (!sub) {
      navigate('/login?error=auth_failed', { replace: true })
      return
    }

    // Persist to store synchronously before navigating
    useAuthStore.getState().login({ id: sub, name, email, picture })

    // Small delay to ensure Zustand persist middleware flushes to localStorage
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 100)
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
