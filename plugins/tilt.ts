export default defineNuxtPlugin((nuxtApp) => {
  const MAX = 8

  interface TiltHandlers {
    enter: () => void
    move: (e: PointerEvent) => void
    leave: () => void
  }

  nuxtApp.vueApp.directive('tilt', {
    // mounted ne s'exécute que côté client, l'accès au DOM est donc sûr
    mounted(el: HTMLElement & { __tilt?: TiltHandlers }) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        const rx = (0.5 - py) * MAX * 2
        const ry = (px - 0.5) * MAX * 2
        el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      }
      const enter = () => el.classList.add('is-tilting')
      const leave = () => {
        el.classList.remove('is-tilting')
        el.style.transform = ''
      }

      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      el.__tilt = { enter, move, leave }
    },
    unmounted(el: HTMLElement & { __tilt?: TiltHandlers }) {
      if (!el.__tilt) return
      el.removeEventListener('pointerenter', el.__tilt.enter)
      el.removeEventListener('pointermove', el.__tilt.move)
      el.removeEventListener('pointerleave', el.__tilt.leave)
    },
  })
})
