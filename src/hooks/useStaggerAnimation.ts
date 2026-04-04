import { useRef } from 'react'
import type React from 'react'

export interface StaggerOptions {
  itemCount: number
  delayMs: number
  durationMs: number
  enabled: boolean
}

export function useStaggerAnimation(options: StaggerOptions) {
  const { delayMs, durationMs, enabled } = options
  const hasAnimatedRef = useRef(false)

  if (enabled && !hasAnimatedRef.current) {
    hasAnimatedRef.current = true
  }

  const getItemStyle = (index: number): React.CSSProperties => {
    if (!enabled || !hasAnimatedRef.current) {
      return {}
    }
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
