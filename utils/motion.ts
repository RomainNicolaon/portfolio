// Source unique de vérité pour l'état « animations réduites » côté client :
// combine la préférence système et le réglage utilisateur (classe html.motion-off).
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  if (document.documentElement.classList.contains('motion-off')) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
