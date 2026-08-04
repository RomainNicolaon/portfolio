export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const reveal = (el: Element) => el.classList.add('is-visible')

  const scan = () => {
    const items = document.querySelectorAll('.reveal:not(.is-visible)')
    if (!items.length) return

    if (isReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(reveal)
      return
    }

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target)
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15 },
      )
    }

    items.forEach((el) => observer!.observe(el))
  }

  nuxtApp.hook('app:mounted', scan)
  // Re-scan après chaque navigation client : sinon les nouveaux éléments .reveal restent masqués.
  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(scan)
  })
})
