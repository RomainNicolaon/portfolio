// Contrôle l'overlay « matrix rain » déclenché depuis le terminal interactif.
export function useMatrix() {
  const active = useState<boolean>('matrix:active', () => false)

  let timer: ReturnType<typeof setTimeout> | undefined

  function start(ms = 7000) {
    if (typeof window === 'undefined' || isReducedMotion()) return false
    active.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (active.value = false), ms)
    return true
  }

  function stop() {
    active.value = false
    if (timer) clearTimeout(timer)
  }

  return { active, start, stop }
}
