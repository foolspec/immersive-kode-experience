import { useEffect, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frameId = 0
    let previous = -1

    const update = () => {
      frameId = 0
      const node = ref.current
      if (!node) {
        return
      }

      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const travel = rect.height + viewportHeight
      const next = clamp((viewportHeight - rect.top) / travel, 0, 1)

      if (Math.abs(next - previous) > 0.001) {
        previous = next
        setProgress(next)
      }
    }

    const schedule = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update)
      }
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [ref])

  return progress
}
