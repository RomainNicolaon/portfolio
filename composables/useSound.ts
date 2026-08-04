let ctx: AudioContext | null = null

// Petits sons de synthèse (WebAudio) — désactivés par défaut, activés via les réglages.
export function useSound() {
  const { sound } = useSettings()

  function beep(freq = 440, dur = 0.05, type: OscillatorType = 'square', gain = 0.03) {
    if (!sound.value || typeof window === 'undefined') return
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = ctx || new Ctor()
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.value = gain
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start()
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
      osc.stop(ctx.currentTime + dur)
    } catch {
      /* audio indisponible */
    }
  }

  return {
    beep,
    key: () => beep(620, 0.025, 'square', 0.015),
    ok: () => beep(880, 0.08, 'triangle', 0.035),
    err: () => beep(150, 0.14, 'sawtooth', 0.045),
    click: () => beep(420, 0.04, 'square', 0.03),
  }
}
