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

  // Double rAF : laisse le temps au nouveau DOM d'être inséré avant de scanner.
  const scanSoon = () => {
    requestAnimationFrame(() => requestAnimationFrame(scan))
  }

  nuxtApp.hook('app:mounted', scan)
  // Re-scan après chaque navigation client : sinon les nouveaux éléments .reveal restent masqués.
  // `page:finish` peut se déclencher pendant la transition « out-in » (ancien DOM encore présent,
  // nouveau pas encore inséré) ; on scanne donc aussi à la fin de la transition, quand le nouveau
  // DOM est en place, pour couvrir le changement de langue et toute navigation client.
  nuxtApp.hook('page:finish', scanSoon)
  nuxtApp.hook('page:transition:finish', scan)
})
