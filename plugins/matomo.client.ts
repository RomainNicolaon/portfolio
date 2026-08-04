// Analytics Matomo, chargé uniquement si un hôte est configuré via NUXT_PUBLIC_MATOMO_URL.
export default defineNuxtPlugin(() => {
  const { matomoUrl, matomoSiteId } = useRuntimeConfig().public
  if (!matomoUrl || !matomoSiteId) return

  const base = String(matomoUrl).replace(/\/+$/, '') + '/'

  const _paq = ((window as unknown as { _paq: unknown[] })._paq ||= [])
  _paq.push(['trackPageView'])
  _paq.push(['enableLinkTracking'])
  _paq.push(['setTrackerUrl', base + 'matomo.php'])
  _paq.push(['setSiteId', String(matomoSiteId)])

  useHead({
    script: [
      {
        src: base + 'matomo.js',
        async: true,
        defer: true,
      },
    ],
  })
})
