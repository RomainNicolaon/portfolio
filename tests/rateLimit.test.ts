import { describe, expect, it } from 'vitest'
import { rateLimit } from '../server/utils/rateLimit'

describe('rateLimit', () => {
  it('autorise jusqu’à la limite puis bloque', () => {
    const key = `test:${Math.random()}`
    const limit = 3
    const window = 60_000

    for (let i = 0; i < limit; i++) {
      expect(rateLimit(key, limit, window).ok).toBe(true)
    }
    const blocked = rateLimit(key, limit, window)
    expect(blocked.ok).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })

  it('décrémente correctement le compteur restant', () => {
    const key = `test:${Math.random()}`
    expect(rateLimit(key, 5, 60_000).remaining).toBe(4)
    expect(rateLimit(key, 5, 60_000).remaining).toBe(3)
  })

  it('réinitialise après expiration de la fenêtre', () => {
    const key = `test:${Math.random()}`
    expect(rateLimit(key, 1, 1).ok).toBe(true)
    // Fenêtre de 1 ms : après un court délai, la clé est réinitialisée.
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(rateLimit(key, 1, 60_000).ok).toBe(true)
        resolve()
      }, 5)
    })
  })

  it('isole les clés différentes', () => {
    const a = `a:${Math.random()}`
    const b = `b:${Math.random()}`
    expect(rateLimit(a, 1, 60_000).ok).toBe(true)
    expect(rateLimit(a, 1, 60_000).ok).toBe(false)
    expect(rateLimit(b, 1, 60_000).ok).toBe(true)
  })
})
