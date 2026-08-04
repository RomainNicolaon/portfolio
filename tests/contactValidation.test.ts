import { describe, expect, it } from 'vitest'
import { validateContact } from '../server/utils/contactValidation'

describe('validateContact', () => {
  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Bonjour, ceci est un message de test suffisamment long.',
  }

  it('accepte un formulaire valide', () => {
    const r = validateContact(valid)
    expect(r.ok).toBe(true)
    expect(r.data).toEqual({
      name: valid.name,
      email: valid.email,
      message: valid.message,
    })
  })

  it('détecte le honeypot et ignore silencieusement', () => {
    const r = validateContact({ ...valid, website: 'http://spam.example' })
    expect(r.ok).toBe(false)
    expect(r.honeypot).toBe(true)
  })

  it('refuse les champs manquants', () => {
    const r = validateContact({ name: '', email: '', message: '' })
    expect(r.ok).toBe(false)
    expect(r.code).toBe(422)
  })

  it('refuse un email invalide', () => {
    const r = validateContact({ ...valid, email: 'pas-un-email' })
    expect(r.ok).toBe(false)
    expect(r.message).toContain('mail')
  })

  it('refuse un message trop court', () => {
    const r = validateContact({ ...valid, message: 'court' })
    expect(r.ok).toBe(false)
    expect(r.message).toContain('court')
  })

  it('refuse un champ trop long', () => {
    const r = validateContact({ ...valid, name: 'x'.repeat(101) })
    expect(r.ok).toBe(false)
  })

  it('nettoie les espaces autour des valeurs', () => {
    const r = validateContact({ ...valid, name: '  Ada  ' })
    expect(r.data?.name).toBe('Ada')
  })
})
