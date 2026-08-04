// Applique les réglages (thème, mouvement) au DOM et les persiste en localStorage.
export default defineNuxtPlugin(() => {
  const { theme, sound, motion, ambient } = useSettings()
  const KEY = 'portfolio:settings'

  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s.theme === 'green' || s.theme === 'amber' || s.theme === 'blue') theme.value = s.theme
      if (typeof s.sound === 'boolean') sound.value = s.sound
      if (s.motion === 'auto' || s.motion === 'reduced') motion.value = s.motion
      if (typeof s.ambient === 'boolean') ambient.value = s.ambient
    }
  } catch {
    /* localStorage indisponible */
  }

  const apply = () => {
    const el = document.documentElement
    el.dataset.theme = theme.value
    el.classList.toggle('motion-off', motion.value === 'reduced')
  }

  apply()

  watch([theme, sound, motion, ambient], () => {
    apply()
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          theme: theme.value,
          sound: sound.value,
          motion: motion.value,
          ambient: ambient.value,
        }),
      )
    } catch {
      /* localStorage indisponible */
    }
  })
})
