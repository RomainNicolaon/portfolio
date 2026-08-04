import nodemailer from 'nodemailer'

interface ContactBody {
  name?: string
  email?: string
  message?: string
  website?: string // honeypot anti-spam
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  // Anti-spam : 5 envois max / 10 min par IP.
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
  if (!limit.ok) {
    setResponseHeader(event, 'Retry-After', limit.retryAfter)
    throw createError({
      statusCode: 429,
      message: 'Trop de tentatives. Réessayez dans quelques minutes.',
    })
  }

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
    throw createError({ statusCode: 422, message: 'Tous les champs sont requis.' })
  }
  if (name.length > 100 || email.length > 150 || message.length > 5000) {
    throw createError({ statusCode: 422, message: 'Un des champs est trop long.' })
  }
  if (!emailRe.test(email)) {
    throw createError({ statusCode: 422, message: 'Adresse e-mail invalide.' })
  }
  if (message.length < 10) {
    throw createError({ statusCode: 422, message: 'Message trop court.' })
  }

  const config = useRuntimeConfig(event)

  // process.env d'abord (noms simples cPanel), runtimeConfig (NUXT_*) en repli.
  const smtpHost = process.env.SMTP_HOST || String(config.smtpHost || '')
  const smtpUser = process.env.SMTP_USER || String(config.smtpUser || '')
  const smtpPass = process.env.SMTP_PASS || String(config.smtpPass || '')
  const smtpPort = process.env.SMTP_PORT || String(config.smtpPort || '')
  const contactTo = process.env.CONTACT_TO || String(config.contactTo || '')
  const contactFrom = process.env.CONTACT_FROM || String(config.contactFrom || '')

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw createError({
      statusCode: 500,
      message: "Le service d'envoi n'est pas configuré.",
    })
  }

  // Anti-injection d'en-têtes : pas de saut de ligne dans les valeurs d'en-tête.
  const safeName = name.replace(/[\r\n]+/g, ' ')
  const safeEmail = email.replace(/[\r\n]+/g, '')

  const port = Number(smtpPort) || 465

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
      message: "L'envoi a échoué. Réessayez ou écrivez-moi directement par e-mail.",
    })
  }

  // Accusé de réception au visiteur (non bloquant).
  try {
    await transporter.sendMail({
      from: `Romain NICOLAON <${contactFrom}>`,
      to: safeEmail,
      subject: 'Votre message a bien été reçu',
      text:
        `Bonjour ${safeName},\n\n` +
        `Merci pour votre message, je l'ai bien reçu et vous répondrai rapidement.\n\n` +
        `Pour rappel, voici votre message :\n${message}\n\n` +
        `— Romain NICOLAON\nhttps://www.nicolaon.fr`,
    })
  } catch {
    // Échec de l'accusé de réception : sans conséquence pour l'utilisateur.
  }

  return { ok: true }
})
