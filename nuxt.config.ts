// https://nuxt.com/docs/api/configuration/nuxt-config
import { projects } from './data/portfolio'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://www.nicolaon.fr',
  },

  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    contactTo: process.env.CONTACT_TO || 'nicolaon.romain@gmail.com',
    contactFrom: process.env.CONTACT_FROM || 'no-reply@nicolaon.fr',
    // Anti-spam Cloudflare Turnstile (opt-in) : défini côté serveur uniquement.
    turnstileSecret: process.env.TURNSTILE_SECRET || '',
    public: {
      siteUrl: 'https://www.nicolaon.fr',
      // Analytics Matomo, opt-in : renseigner NUXT_PUBLIC_MATOMO_URL / _SITE_ID pour activer.
      matomoUrl: process.env.NUXT_PUBLIC_MATOMO_URL || 'https://matomo.nicolaon.fr',
      matomoSiteId: process.env.NUXT_PUBLIC_MATOMO_SITE_ID || '2',
      // Clé publique Turnstile : le widget ne s'affiche que si elle est renseignée.
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
    },
  },

  ssr: true,

  nitro: {
    // App Node (O2Switch) : pages prérendues pour la perf + /api dynamique.
    prerender: {
      crawlLinks: true,
      routes: ['/', ...projects.map((p) => `/projets/${slugify(p.name)}`)],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr', class: 'scroll-smooth' },
      bodyAttrs: {
        class:
          'bg-term-bg text-term-muted font-mono antialiased selection:bg-term-green selection:text-term-bg',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      meta: [
        { name: 'theme-color', content: '#0a0e0a' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%2322c55e'>&gt;_</text></svg>",
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap',
        },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Romain NICOLAON — Projets',
          href: '/rss.xml',
        },
      ],
      script: [
        {
          innerHTML:
            "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WQGXPRXG');",
        },
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-FCQ3N8Z932',
        },
        {
          innerHTML:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-FCQ3N8Z932');",
        },
      ],
      noscript: [
        {
          innerHTML:
            '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WQGXPRXG" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          tagPosition: 'bodyOpen',
        },
      ],
    },
  },
})
