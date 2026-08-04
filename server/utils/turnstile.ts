// Vérifie un jeton Cloudflare Turnstile. Retourne true si l'anti-spam est désactivé (pas de secret).
export async function verifyTurnstile(
  secret: string,
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  if (!secret) return true
  if (!token) return false

  try {
    const res = await $fetch<{ success: boolean }>(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }).toString(),
      },
    )
    return res.success === true
  } catch {
    return false
  }
}
