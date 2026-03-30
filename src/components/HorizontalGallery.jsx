import { useEffect, useMemo, useRef, useState } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import RevealBlock from './RevealBlock'

export default function HorizontalGallery({ id, entries }) {
  const sectionRef = useRef(null)
  const progress = useScrollProgress(sectionRef)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  )

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const geometry = useMemo(() => {
    const cardWidth = Math.min(viewportWidth * 0.7, 680)
    const gap = Math.max(24, viewportWidth * 0.055)
    const trackWidth = entries.length * cardWidth + (entries.length - 1) * gap
    const maxOffset = Math.max(0, trackWidth - viewportWidth * 0.9)
    return {
      cardWidth,
      gap,
      maxOffset,
      x: -progress * maxOffset,
    }
  }, [entries.length, progress, viewportWidth])

  return (
    <section id={id} ref={sectionRef} className="section gallery-hybrid">
      <div className="gallery-sticky">
        <RevealBlock className="gallery-heading" once={false}>
          <p className="section-index">[047]</p>
          <h2 className="gallery-title">ORBITAL INDEX / HYBRID SCROLL</h2>
          <p className="gallery-progress">{Math.round(progress * 100)}%</p>
        </RevealBlock>

        <div className="gallery-viewport">
          <div
            className="gallery-track"
            style={{
              transform: `translate3d(${geometry.x}px, 0, 0)`,
              gap: `${geometry.gap}px`,
            }}
          >
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="gallery-card"
                style={{ width: `${geometry.cardWidth}px` }}
              >
                <p className="gallery-card-id">[{entry.id}]</p>
                <h3>{entry.title}</h3>
                <p>{entry.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
