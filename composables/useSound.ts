let ctx: AudioContext | null = null
let humNodes: { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null

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

  // Hum d'ambiance type moniteur CRT (basse fréquence + harmonique 100 Hz).
  function ambientOn() {
    if (humNodes || typeof window === 'undefined') return
    const c = ensureCtx()
    if (!c) return
    try {
      const osc = c.createOscillator()
      const osc2 = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = 50
      osc2.type = 'sine'
      osc2.frequency.value = 100
      gain.gain.value = 0.0001
      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(c.destination)
      osc.start()
      osc2.start()
      gain.gain.exponentialRampToValueAtTime(0.012, c.currentTime + 0.8)
      humNodes = { osc, osc2, gain }
    } catch {
      /* audio indisponible */
    }
  }

  function ambientOff() {
    if (!humNodes || !ctx) return
    try {
      const { osc, osc2, gain } = humNodes
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
      osc.stop(ctx.currentTime + 0.5)
      osc2.stop(ctx.currentTime + 0.5)
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
