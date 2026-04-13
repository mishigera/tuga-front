import { useNavigate } from 'react-router-dom'
import {
  MapPin, Tag, Bell, Users, HelpCircle, //clock,
  ChevronRight, Settings, User,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const MENU_ITEMS = [
  { icon: MapPin, label: 'Mis Direcciones', desc: 'Gestiona tus direcciones de entrega', to: '/perfil/direcciones' },
  { icon: Tag, label: 'Cupones y Promociones', desc: 'Descuentos disponibles para ti', to: '/perfil/cupones' },
  { icon: Bell, label: 'Notificaciones', desc: 'Alertas y preferencias' },
  // { icon: Clock, label: 'Historial de Pedidos', desc: 'Revisa tus pedidos anteriores', to: '/pedidos' }, ya tenemos una seccion para eso
  { icon: Users, label: 'Invitar Amigos', desc: 'Comparte y gana descuentos', to: '/perfil/invitar' },
  { icon: HelpCircle, label: 'Ayuda y Soporte', desc: 'Centro de ayuda y contacto', to: '/perfil/soporte' },
]

export function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }
  const avatarSrc = user?.picture ?? null
  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 0' }}>
        <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1 }}>
          Mi Perfil
        </span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A9DA8' }}>
          <Settings size={20} />
        </button>
      </div>

      {/* Avatar & info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 28px' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#1E2128',
          border: '2px solid #5A8A3A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}>
           {avatarSrc
              ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : <User size={36} color="#5A8A3A" />
            }
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          {user?.name ?? 'Usuario'}
        </h2>
        <p style={{ color: '#9A9DA8', fontSize: 14, marginBottom: 16 }}>
          {user?.email ?? ''}
        </p>
        <button
          onClick={() => navigate('/perfil/editar')}
          style={{
            padding: '8px 20px',
            background: 'transparent',
            border: '1px solid #5A8A3A',
            borderRadius: 20,
            color: '#5A8A3A',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Editar Perfil
        </button>
      </div>

      {/* Menu */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {MENU_ITEMS.map(({ icon: Icon, label, desc, to }) => (
          <button
            key={label}
            onClick={() => to && navigate(to)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: '#181B21',
              border: 'none',
              borderRadius: 14,
              padding: '14px 16px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              marginBottom: 6,
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              background: 'rgba(90,138,58,0.12)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color="#5A8A3A" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#9A9DA8' }}>{desc}</div>
            </div>
            <ChevronRight size={16} color="#5A5D68" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '16px 16px 8px' }}>
        <button
          className="btn-secondary"
          onClick={handleLogout}
          style={{ color: '#E74C3C', borderColor: '#E74C3C22' }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
