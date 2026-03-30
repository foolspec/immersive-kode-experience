import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useAmbientSound() {
  const [enabled, setEnabled] = useState(false)
  const nodesRef = useRef(null)

  const supported = useMemo(
    () => typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext),
    [],
  )

  const stop = useCallback(() => {
    const nodes = nodesRef.current
    if (!nodes) {
      return
    }

    const { context, master, oscillators, lfo } = nodes
    const stopAt = context.currentTime + 0.35

    master.gain.cancelScheduledValues(context.currentTime)
    master.gain.setTargetAtTime(0.0001, context.currentTime, 0.08)

    oscillators.forEach((oscillator) => {
      oscillator.stop(stopAt)
    })

    lfo.stop(stopAt)

    window.setTimeout(() => {
      context.close().catch(() => {})
    }, 450)

    nodesRef.current = null
  }, [])

  const start = useCallback(async () => {
    if (!supported || nodesRef.current) {
      return
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()

    const master = context.createGain()
    master.gain.value = 0.0001

    const lowPass = context.createBiquadFilter()
    lowPass.type = 'lowpass'
    lowPass.frequency.value = 620

    const highPass = context.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.value = 45

    const oscA = context.createOscillator()
    oscA.type = 'sine'
    oscA.frequency.value = 42

    const oscB = context.createOscillator()
    oscB.type = 'triangle'
    oscB.frequency.value = 67

    const oscGainA = context.createGain()
    oscGainA.gain.value = 0.2

    const oscGainB = context.createGain()
    oscGainB.gain.value = 0.1

    const lfo = context.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.09

    const lfoDepth = context.createGain()
    lfoDepth.gain.value = 9

    lfo.connect(lfoDepth)
    lfoDepth.connect(lowPass.frequency)

    oscA.connect(oscGainA)
    oscB.connect(oscGainB)
    oscGainA.connect(highPass)
    oscGainB.connect(highPass)
    highPass.connect(lowPass)
    lowPass.connect(master)
    master.connect(context.destination)

    lfo.start()
    oscA.start()
    oscB.start()

    master.gain.setTargetAtTime(0.04, context.currentTime, 0.35)

    if (context.state === 'suspended') {
      await context.resume()
    }

    nodesRef.current = {
      context,
      master,
      oscillators: [oscA, oscB],
      lfo,
    }
  }, [supported])

  const toggle = useCallback(async () => {
    if (!supported) {
      return
    }

    if (enabled) {
      stop()
      setEnabled(false)
      return
    }

    await start()
    setEnabled(true)
  }, [enabled, start, stop, supported])

  useEffect(() => () => stop(), [stop])

  return {
    enabled,
    supported,
    toggle,
  }
}
