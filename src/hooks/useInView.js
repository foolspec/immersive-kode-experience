import { useEffect, useState } from 'react'

export function useInView(ref, options = {}) {
  const { threshold = 0.2, rootMargin = '0px', once = true } = options
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)

          if (once) {
            observer.disconnect()
          }
          return
        }

        if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [once, ref, rootMargin, threshold])

  return inView
}
