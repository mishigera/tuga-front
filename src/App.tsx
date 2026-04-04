import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { AnimatedRoutes } from './components/AnimatedRoutes'
import { Login } from './pages/Login'
import { AuthCallback } from './pages/AuthCallback'
import { Home } from './pages/Home'
import { ShopMenu } from './pages/ShopMenu'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderStatus } from './pages/OrderStatus'
import { Profile } from './pages/Profile'
import { Favorites } from './pages/Favorites'
import { Orders } from './pages/Orders'
import { AddressManager } from './pages/AddressManager'
import { CouponManager } from './pages/CouponManager'
import { ProfileEditor } from './pages/ProfileEditor'
import { SupportCenter } from './pages/SupportCenter'
import { InviteFeature } from './pages/InviteFeature'
import { useAuthStore } from './store/authStore'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Animated protected routes */}
      <Route
        element={
          <RequireAuth>
            <AnimatedRoutes />
          </RequireAuth>
        }
      >
        {/* Routes with bottom nav */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <BottomNav />
            </>
          }
        />
        <Route
          path="/favoritos"
          element={
            <>
              <Favorites />
              <BottomNav />
            </>
          }
        />
        <Route
          path="/pedidos"
          element={
            <>
              <Orders />
              <BottomNav />
            </>
          }
        />
        <Route
          path="/perfil"
          element={
            <>
              <Profile />
              <BottomNav />
            </>
          }
        />

        {/* Full-screen routes (no bottom nav) */}
        <Route path="/restaurante/:id" element={<ShopMenu />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/estado-pedido/:id" element={<OrderStatus />} />
        <Route path="/perfil/direcciones" element={<AddressManager />} />
        <Route path="/perfil/cupones" element={<CouponManager />} />
        <Route path="/perfil/editar" element={<ProfileEditor />} />
        <Route path="/perfil/soporte" element={<SupportCenter />} />
        <Route path="/perfil/invitar" element={<InviteFeature />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
