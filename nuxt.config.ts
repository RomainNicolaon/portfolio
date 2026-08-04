// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://www.nicolaon.fr',
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://www.nicolaon.fr',
    },
  },

  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
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
