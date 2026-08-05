// Konami code (↑ ↑ ↓ ↓ ← → ← → B A) → débloque le thème secret « synthwave ».
export default defineNuxtPlugin(() => {
  const { theme, secretUnlocked } = useSettings()
  const toast = useToast()
  const sound = useSound()
  const sequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ]
  let pos = 0

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    pos = key === sequence[pos] ? pos + 1 : key === sequence[0] ? 1 : 0
    if (pos === sequence.length) {
      pos = 0
      secretUnlocked.value = true
      theme.value = 'synthwave'
      sound.ok()
      const { t } = useNuxtApp().$i18n as { t: (k: string) => string }
      toast.push(t('toast.cheatUnlocked'), t('toast.synthwaveHint'))
    }
  })
})
