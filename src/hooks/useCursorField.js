import { useEffect } from 'react'

const lerp = (start, end, amount) => start + (end - start) * amount

export function useCursorField() {
  useEffect(() => {
    const root = document.documentElement
    let frameId = 0

    const state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      absoluteX: window.innerWidth * 0.5,
      absoluteY: window.innerHeight * 0.5,
    }

    const render = () => {
      frameId = window.requestAnimationFrame(render)
      state.currentX = lerp(state.currentX, state.targetX, 0.14)
      state.currentY = lerp(state.currentY, state.targetY, 0.14)

      root.style.setProperty('--pointer-x', state.currentX.toFixed(4))
      root.style.setProperty('--pointer-y', state.currentY.toFixed(4))
      root.style.setProperty('--pointer-abs-x', `${state.absoluteX.toFixed(1)}px`)
      root.style.setProperty('--pointer-abs-y', `${state.absoluteY.toFixed(1)}px`)
    }

    const handlePointerMove = (event) => {
      const width = window.innerWidth || 1
      const height = window.innerHeight || 1

      state.absoluteX = event.clientX
      state.absoluteY = event.clientY
      state.targetX = (event.clientX / width) * 2 - 1
      state.targetY = (event.clientY / height) * 2 - 1
    }

    render()
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])
}
