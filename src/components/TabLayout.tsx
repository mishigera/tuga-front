import { useLocation, Routes, Route } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Home } from '../pages/Home'
import { Favorites } from '../pages/Favorites'
import { Orders } from '../pages/Orders'
import { Profile } from '../pages/Profile'
import { ShopMenu } from '../pages/ShopMenu'
import { Cart } from '../pages/Cart'
import { Checkout } from '../pages/Checkout'
import { OrderStatus } from '../pages/OrderStatus'
import { AddressManager } from '../pages/AddressManager'
import { CouponManager } from '../pages/CouponManager'
import { ProfileEditor } from '../pages/ProfileEditor'
import { SupportCenter } from '../pages/SupportCenter'
import { InviteFeature } from '../pages/InviteFeature'

const TAB_PATHS = new Set(['/', '/favoritos', '/pedidos', '/perfil'])

const TABS = [
  { path: '/', Component: Home },
  { path: '/favoritos', Component: Favorites },
  { path: '/pedidos', Component: Orders },
  { path: '/perfil', Component: Profile },
]

// Map tab paths to the query keys they use
const TAB_QUERIES: Record<string, string[][]> = {
  '/':          [['shops']],
  '/favoritos': [['shops']],
  '/pedidos':   [['orders']],
  '/perfil':    [],
}

export function TabLayout() {
  const { pathname } = useLocation()
  const isTab = TAB_PATHS.has(pathname)
  const queryClient = useQueryClient()

  // Track which tabs have been visited — only mount on first visit
  const visitedRef = useRef(new Set<string>())
  if (isTab) visitedRef.current.add(pathname)

  // Refetch queries in background when switching to a tab
  useEffect(() => {
    if (!isTab) return
    const queries = TAB_QUERIES[pathname]
    queries?.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key })
    })
  }, [pathname, isTab, queryClient])

  return (
    <>
      {/* Tab pages — stay mounted once visited, shown/hidden via CSS */}
      {TABS.map(({ path, Component }) => {
        if (!visitedRef.current.has(path)) return null
        return (
          <div
            key={path}
            style={{ display: pathname === path ? 'contents' : 'none' }}
          >
            <Component />
          </div>
        )
      })}

      {/* Deep pages — mount/unmount normally */}
      {!isTab && (
        <Routes>
          <Route path="/restaurante/:id" element={<ShopMenu />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/estado-pedido/:id" element={<OrderStatus />} />
          <Route path="/perfil/direcciones" element={<AddressManager />} />
          <Route path="/perfil/cupones" element={<CouponManager />} />
          <Route path="/perfil/editar" element={<ProfileEditor />} />
          <Route path="/perfil/soporte" element={<SupportCenter />} />
          <Route path="/perfil/invitar" element={<InviteFeature />} />
        </Routes>
      )}
    </>
  )
}
