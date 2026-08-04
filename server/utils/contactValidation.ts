export interface ContactInput {
  name?: string
  email?: string
  message?: string
  website?: string // honeypot anti-spam
}

export interface ContactValidationResult {
  ok: boolean
  honeypot?: boolean
  code?: number
  message?: string
  data?: { name: string; email: string; message: string }
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validation pure (sans dépendance HTTP) pour être testable unitairement.
export function validateContact(body: ContactInput): ContactValidationResult {
  const name = (body?.name ?? '').trim()
  const email = (body?.email ?? '').trim()
  const message = (body?.message ?? '').trim()
  const website = (body?.website ?? '').trim()

  if (website !== '') return { ok: false, honeypot: true }
  if (!name || !email || !message)
    return { ok: false, code: 422, message: 'Tous les champs sont requis.' }
  if (name.length > 100 || email.length > 150 || message.length > 5000)
    return { ok: false, code: 422, message: 'Un des champs est trop long.' }
  if (!emailRe.test(email))
    return { ok: false, code: 422, message: 'Adresse e-mail invalide.' }
  if (message.length < 10) return { ok: false, code: 422, message: 'Message trop court.' }

  return { ok: true, data: { name, email, message } }
}
