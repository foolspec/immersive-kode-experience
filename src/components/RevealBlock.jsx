import { useRef } from 'react'
import { useInView } from '../hooks/useInView'

export default function RevealBlock({ children, className = '', once = true }) {
  const ref = useRef(null)
  const visible = useInView(ref, {
    threshold: 0.24,
    rootMargin: '0px 0px -8% 0px',
    once,
  })

  const classes = ['reveal-block', className, visible ? 'is-visible' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  )
}
