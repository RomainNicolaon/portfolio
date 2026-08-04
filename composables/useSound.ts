let ctx: AudioContext | null = null
let humNodes: { osc: OscillatorNode; whine: OscillatorNode; gain: GainNode } | null = null

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = ctx || new Ctor()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// Petits sons de synthèse (WebAudio) — désactivés par défaut, activés via les réglages.
export function useSound() {
  const { sound } = useSettings()

  function beep(freq = 440, dur = 0.05, type: OscillatorType = 'square', gain = 0.03) {
    if (!sound.value || typeof window === 'undefined') return
    try {
      const c = ensureCtx()
      if (!c) return
      const osc = c.createOscillator()
      const g = c.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.value = gain
      osc.connect(g)
      g.connect(c.destination)
      osc.start()
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
      osc.stop(c.currentTime + dur)
    } catch {
      /* audio indisponible */
    }
  }

  // Hum d'ambiance type moniteur CRT : bourdon 120 Hz (audible) + fin sifflement du transfo (~15,7 kHz).
  function ambientOn() {
    if (humNodes || typeof window === 'undefined') return
    const c = ensureCtx()
    if (!c) return
    try {
      const osc = c.createOscillator()
      const whine = c.createOscillator()
      const gain = c.createGain()
      const whineGain = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = 120
      whine.type = 'sine'
      whine.frequency.value = 15720
      gain.gain.value = 0.0001
      whineGain.gain.value = 0.004
      osc.connect(gain)
      whine.connect(whineGain)
      gain.connect(c.destination)
      whineGain.connect(c.destination)
      osc.start()
      whine.start()
      gain.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 0.8)
      humNodes = { osc, whine, gain }
    } catch {
      /* audio indisponible */
    }
  }

  function ambientOff() {
    if (!humNodes || !ctx) return
    try {
      const { osc, whine, gain } = humNodes
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
      osc.stop(ctx.currentTime + 0.5)
      whine.stop(ctx.currentTime + 0.5)
    } catch {
      /* ignore */
    }
    humNodes = null
  }

  return {
    beep,
    ambientOn,
    ambientOff,
    key: () => beep(620, 0.025, 'square', 0.015),
    ok: () => beep(880, 0.08, 'triangle', 0.035),
    err: () => beep(150, 0.14, 'sawtooth', 0.045),
    click: () => beep(420, 0.04, 'square', 0.03),
  }
}
