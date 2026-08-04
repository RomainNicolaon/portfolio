interface Hit {
  count: number
  reset: number
}

const store = new Map<string, Hit>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  retryAfter: number
}

// Limiteur de débit en mémoire (par process). Suffisant pour un formulaire de contact.
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const hit = store.get(key)

  if (!hit || hit.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }

  hit.count++
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.reset - now) / 1000) }
  }
  return { ok: true, remaining: limit - hit.count, retryAfter: 0 }
}
