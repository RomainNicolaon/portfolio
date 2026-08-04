// Démarre/arrête le hum d'ambiance CRT selon le réglage utilisateur.
export default defineNuxtPlugin(() => {
  const { ambient } = useSettings()
  const { ambientOn, ambientOff } = useSound()

  watch(
    ambient,
    (on) => {
      if (on) ambientOn()
      else ambientOff()
    },
    { immediate: false },
  )
})
