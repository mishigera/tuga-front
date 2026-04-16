import { useRef } from 'react'
import type React from 'react'

// Tracks which keys have already animated — capped to prevent memory leaks
const animatedKeys = new Set<string>()
const MAX_KEYS = 100

export interface StaggerOptions {
  itemCount: number
  delayMs: number
  durationMs: number
  enabled: boolean
  key?: string // unique key to prevent re-animation (e.g. query key)
}

export function useStaggerAnimation(options: StaggerOptions) {
  const { delayMs, durationMs, enabled, key } = options
  const hasAnimatedRef = useRef(false)

  const alreadyAnimated = key ? animatedKeys.has(key) : false

  if (enabled && !hasAnimatedRef.current && !alreadyAnimated) {
    hasAnimatedRef.current = true
    if (key) {
      if (animatedKeys.size >= MAX_KEYS) animatedKeys.clear()
      animatedKeys.add(key)
    }
  }

  const shouldAnimate = hasAnimatedRef.current && !alreadyAnimated

  const getItemStyle = (index: number): React.CSSProperties => {
    if (!enabled || !shouldAnimate) return {}
    return {
      animationName: 'stagger-enter',
      animationDuration: `${durationMs}ms`,
      animationTimingFunction: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      animationFillMode: 'both',
      animationDelay: `${index * delayMs}ms`,
    }
  }

  return {
    getItemStyle,
    hasAnimated: hasAnimatedRef.current,
    className: '',
  }
}
