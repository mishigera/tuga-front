import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Heart, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/favoritos', icon: Heart, label: 'Favoritos' },
  { to: '/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

const TAB_ROUTES = new Set(['/', '/favoritos', '/pedidos', '/perfil'])

export function BottomNav() {
  const { pathname } = useLocation()
  const visible = TAB_ROUTES.has(pathname)
  const totalItems = useCartStore((s) => s.totalItems())
  const [tappedItem, setTappedItem] = useState<string | null>(null)

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: visible ? 'translateX(-50%)' : 'translateX(-50%) translateY(100%)',
        width: '100%',
        maxWidth: 430,
        background: '#181B21',
        borderTop: '1px solid #252830',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
        transition: 'transform 200ms ease-out',
      }}
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onMouseDown={() => setTappedItem(to)}
          onMouseUp={() => setTappedItem(null)}
          onTouchStart={() => setTappedItem(to)}
          onTouchEnd={() => setTappedItem(null)}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '10px 0',
            textDecoration: 'none',
            color: isActive ? '#5A8A3A' : '#5A5D68',
            fontSize: 10,
            fontWeight: 500,
            position: 'relative',
          })}
        >
          {({ isActive }) => (
            <>
              <div style={{ position: 'relative' }}>
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={tappedItem === to ? 'icon--tap' : undefined}
                />
                {label === 'Pedidos' && totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    background: '#5A8A3A',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <span>{label}</span>
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 2,
                  background: '#5A8A3A',
                  borderRadius: '0 0 4px 4px',
                }} />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
