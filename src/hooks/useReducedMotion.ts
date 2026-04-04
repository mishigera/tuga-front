import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const getMatch = () => {
    if (typeof window === 'undefined') return false
    if (!window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const [reducedMotion, setReducedMotion] = useState(getMatch)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}
