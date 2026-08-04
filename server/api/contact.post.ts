import nodemailer from 'nodemailer'

interface ContactBody {
  name?: string
  email?: string
  message?: string
  website?: string // honeypot anti-spam
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  const name = (body?.name ?? '').trim()
  const email = (body?.email ?? '').trim()
  const message = (body?.message ?? '').trim()
  const website = (body?.website ?? '').trim()

  // Un bot a rempli le champ caché → on fait semblant d'accepter.
  if (website !== '') {
    return { ok: true }
  }

  if (!name || !email || !message) {
    throw createError({ statusCode: 422, statusMessage: 'Tous les champs sont requis.' })
  }
  if (name.length > 100 || email.length > 150 || message.length > 5000) {
    throw createError({ statusCode: 422, statusMessage: 'Un des champs est trop long.' })
  }
  if (!emailRe.test(email)) {
    throw createError({ statusCode: 422, statusMessage: 'Adresse e-mail invalide.' })
  }
  if (message.length < 10) {
    throw createError({ statusCode: 422, statusMessage: 'Message trop court.' })
  }

  const config = useRuntimeConfig(event)

  const smtpHost = String(config.smtpHost || '')
  const smtpUser = String(config.smtpUser || '')
  const smtpPass = String(config.smtpPass || '')
  const contactTo = String(config.contactTo || '')
  const contactFrom = String(config.contactFrom || '')

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw createError({
      statusCode: 500,
      statusMessage: "Le service d'envoi n'est pas configuré.",
    })
  }

  // Anti-injection d'en-têtes : pas de saut de ligne dans les valeurs d'en-tête.
  const safeName = name.replace(/[\r\n]+/g, ' ')
  const safeEmail = email.replace(/[\r\n]+/g, '')

  const port = Number(config.smtpPort) || 465

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: smtpUser, pass: smtpPass },
  })

  try {
    await transporter.sendMail({
      from: `Portfolio <${contactFrom}>`,
      to: contactTo,
      replyTo: `${safeName} <${safeEmail}>`,
      subject: `Portfolio — message de ${safeName}`,
      text: `Nom : ${safeName}\nE-mail : ${safeEmail}\n\nMessage :\n${message}\n`,
    })
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: "L'envoi a échoué. Réessayez ou écrivez-moi directement par e-mail.",
    })
  }

  return { ok: true }
})
