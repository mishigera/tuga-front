import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { ShopMenu } from './pages/ShopMenu'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderStatus } from './pages/OrderStatus'
import { Profile } from './pages/Profile'
import { Favorites } from './pages/Favorites'
import { Orders } from './pages/Orders'
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

      {/* Protected routes with bottom nav */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <>
              <Home />
              <BottomNav />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/favoritos"
        element={
          <RequireAuth>
            <>
              <Favorites />
              <BottomNav />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/pedidos"
        element={
          <RequireAuth>
            <>
              <Orders />
              <BottomNav />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/perfil"
        element={
          <RequireAuth>
            <>
              <Profile />
              <BottomNav />
            </>
          </RequireAuth>
        }
      />

      {/* Full-screen routes (no bottom nav) */}
      <Route
        path="/restaurante/:id"
        element={<RequireAuth><ShopMenu /></RequireAuth>}
      />
      <Route
        path="/carrito"
        element={<RequireAuth><Cart /></RequireAuth>}
      />
      <Route
        path="/checkout"
        element={<RequireAuth><Checkout /></RequireAuth>}
      />
      <Route
        path="/estado-pedido/:id"
        element={<RequireAuth><OrderStatus /></RequireAuth>}
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
