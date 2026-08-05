export interface Toast {
  id: number
  text: string
  hint?: string
}

// File d'attente globale de notifications éphémères (toasts) affichées en overlay.
export function useToast() {
  const toasts = useState<Toast[]>('toast:list', () => [])
  let seq = 0

  function push(text: string, hint?: string, ms = 4000) {
    const id = ++seq
    toasts.value = [...toasts.value, { id, text, hint }]
    if (typeof window !== 'undefined') {
      setTimeout(() => dismiss(id), ms)
    }
    return id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, push, dismiss }
}
