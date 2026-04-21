import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { TabLayout } from './components/TabLayout'
import { Login } from './pages/Login'
import { AuthCallback } from './pages/AuthCallback'
import { useAuthStore } from './store/authStore'
import { useDeepLinkAuth } from './hooks/useDeepLinkAuth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function App() {
  useDeepLinkAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <TabLayout />
            <BottomNav />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
