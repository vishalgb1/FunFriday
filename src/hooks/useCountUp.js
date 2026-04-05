import { useState, useEffect, useRef } from 'react'
 
/**
 * Animates a numeric value from its previous value to the new target.
 * Returns the current display value (integer).
 */
export function useCountUp(target, duration = 550) {
  const [value, setValue] = useState(target)
  const prev = useRef(target)
 
  useEffect(() => {
    if (prev.current === target) return
    const start = prev.current
    const end = target
    const startTime = performance.now()
 
    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(start + (end - start) * eased))
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        prev.current = target
      }
    }
 
    requestAnimationFrame(tick)
  }, [target, duration])
 
  return value
}