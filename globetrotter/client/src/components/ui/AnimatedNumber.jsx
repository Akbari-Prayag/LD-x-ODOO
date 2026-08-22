import { useEffect, useState } from 'react'

/**
 * Counts up smoothly from 0 to value with customizable formatting
 */
export default function AnimatedNumber({
  value = 0,
  duration = 800,
  prefix = '',
  suffix = '',
  format = (n) => Number(n).toLocaleString(),
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTimestamp = null
    const target = Number(value) || 0
    if (target === 0) {
      setDisplayValue(0)
      return
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.floor(easedProgress * target)
      setDisplayValue(current)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setDisplayValue(target)
      }
    }

    const frameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frameId)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {format(displayValue)}
      {suffix}
    </span>
  )
}
