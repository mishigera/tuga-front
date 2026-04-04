import { useLocation } from 'react-router-dom'
import { useRef } from 'react'

export type Direction = 'forward' | 'backward' | 'none'

const DETAIL_ROUTES = ['/restaurante/', '/carrito', '/checkout', '/estado-pedido/']
const ROOT_ROUTES = ['/', '/favoritos', '/pedidos', '/perfil']

export function classifyRoute(path: string): 'detail' | 'root' | 'other' {
  if (DETAIL_ROUTES.some(r => path.startsWith(r) || path === r)) return 'detail'
  if (ROOT_ROUTES.some(r => path === r)) return 'root'
  return 'other'
}

export function useNavigationDirection(): Direction {
  const location = useLocation()
  const prevPathRef = useRef<string | null>(null)
  const directionRef = useRef<Direction>('none')

  const currentType = classifyRoute(location.pathname)
  const prevPath = prevPathRef.current
  const prevType = prevPath ? classifyRoute(prevPath) : null

  if (prevPath !== location.pathname) {
    if (currentType === 'detail') {
      directionRef.current = 'forward'
    } else if (currentType === 'root' && prevType === 'detail') {
      directionRef.current = 'backward'
    } else {
      directionRef.current = 'none'
    }
    prevPathRef.current = location.pathname
  }

  return directionRef.current
}
