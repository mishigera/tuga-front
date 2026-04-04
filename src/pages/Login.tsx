import { Truck } from 'lucide-react'

export function Login() {
  function handleGoogle() {
    window.location.href = '/api/users/googleAuth'
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
      <p style={{ color: '#9A9DA8', marginBottom: 60, fontSize: 14 }}>
        El Itacate de la Region
      </p>

      <button className="btn-secondary" onClick={handleGoogle} style={{ width: '100%' }}>
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
