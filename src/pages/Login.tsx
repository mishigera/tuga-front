import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { usersApi } from '../api/users'

export function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const user = await usersApi.create({ name, email, password })
        login({ id: user._id, name: user.name, email: user.email })
      } else {
        // Simple login: find user by email (backend doesn't have login endpoint for users yet)
        // We store locally for now and use the email as identifier
        login({ id: Date.now().toString(), name: email.split('@')[0], email })
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogle() {
    // Mock Google auth — navigate directly
    login({ id: 'google-user', name: 'Emmanuel', email: 'emmanuel@correo.com' })
    navigate('/', { replace: true })
  }

  return (
    <div className="page--no-nav" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '40px 24px',
      background: '#0E1014',
    }}>
      {/* Logo */}
      <div style={{
        width: 72,
        height: 72,
        background: '#5A8A3A',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Truck size={36} color="#fff" />
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: -0.5 }}>
        Tuga App
      </h1>
      <p style={{ color: '#9A9DA8', marginBottom: 40, fontSize: 14 }}>
        El Itacate de la Region
      </p>

      {/* Toggle */}
      <div style={{
        display: 'flex',
        background: '#181B21',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        width: '100%',
      }}>
        {(['login', 'register'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: 9,
              background: mode === m ? '#5A8A3A' : 'transparent',
              color: mode === m ? '#fff' : '#9A9DA8',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {m === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mode === 'register' && (
          <input
            className="input"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p style={{ color: '#E74C3C', fontSize: 13, textAlign: 'center' }}>{error}</p>
        )}
        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '20px 0',
        width: '100%',
      }}>
        <div style={{ flex: 1, height: 1, background: '#252830' }} />
        <span style={{ color: '#5A5D68', fontSize: 13 }}>o</span>
        <div style={{ flex: 1, height: 1, background: '#252830' }} />
      </div>

      <button className="btn-secondary" onClick={handleGoogle}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
        </svg>
        Continuar con Google
      </button>

      <p style={{ marginTop: 40, fontSize: 11, color: '#5A5D68', textAlign: 'center' }}>
        © 2026 Byte IT Consulting &nbsp;·&nbsp; Privacidad &nbsp;·&nbsp; Términos &nbsp;·&nbsp; Soporte
      </p>
    </div>
  )
}
