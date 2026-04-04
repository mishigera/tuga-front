import { useLocation, useOutlet } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { useNavigationDirection, Direction } from '../hooks/useNavigationDirection'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Duración máxima de animación de página en ms
const PAGE_ANIM_DURATION = 280

function getEnterClass(direction: Direction): string {
  if (direction === 'forward') return 'anim-slide-in-right'
  if (direction === 'backward') return 'anim-slide-in-left'
  return 'anim-fade-in'
}

function getExitClass(direction: Direction): string {
  if (direction === 'forward') return 'anim-slide-out-left'
  if (direction === 'backward') return 'anim-slide-out-right'
  return 'anim-fade-out'
}

export function AnimatedRoutes() {
  const location = useLocation()
  const outlet = useOutlet()
  const direction = useNavigationDirection()
  const reducedMotion = useReducedMotion()

  // Guardar el outlet anterior para la transición de salida
  const prevOutletRef = useRef(outlet)
  const prevLocationRef = useRef(location)

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [exitContent, setExitContent] = useState<React.ReactNode>(null)
  const [exitClass, setExitClass] = useState('')
  const [enterClass, setEnterClass] = useState('')

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cuando cambia la ruta, iniciar transición
  useEffect(() => {
    if (location.key === prevLocationRef.current.key) return
    if (reducedMotion) {
      prevOutletRef.current = outlet
      prevLocationRef.current = location
      return
    }

    // Guardar contenido saliente
    setExitContent(prevOutletRef.current)
    setExitClass(getExitClass(direction))
    setEnterClass(getEnterClass(direction))
    setIsTransitioning(true)

    // Timeout de seguridad
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false)
      setExitContent(null)
      prevOutletRef.current = outlet
      prevLocationRef.current = location
    }, PAGE_ANIM_DURATION + 50)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [location.key])

  // Actualizar ref cuando no hay transición
  useEffect(() => {
    if (!isTransitioning) {
      prevOutletRef.current = outlet
      prevLocationRef.current = location
    }
  }, [isTransitioning, outlet])

  const handleExitEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsTransitioning(false)
    setExitContent(null)
  }

  if (!isTransitioning) {
    return (
      <div data-page-wrapper style={{ position: 'relative', overflow: 'hidden' }}>
        {outlet}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Página saliente */}
      <div
        data-page-wrapper
        className={exitClass}
        style={{ pointerEvents: 'none', position: 'absolute', width: '100%', top: 0 }}
        onAnimationEnd={handleExitEnd}
      >
        {exitContent}
      </div>
      {/* Página entrante */}
      <div
        data-page-wrapper
        className={enterClass}
        style={{ position: 'relative' }}
      >
        {outlet}
      </div>
    </div>
  )
}
