// État global de la palette de commandes (Ctrl/⌘+K).
export function useCommandPalette() {
  const open = useState<boolean>('cmdk:open', () => false)
  function toggle() {
    open.value = !open.value
  }
  function close() {
    open.value = false
  }
  return { open, toggle, close }
}
