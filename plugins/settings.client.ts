// Applique les réglages (thème, mouvement) au DOM et les persiste en localStorage.
export default defineNuxtPlugin(() => {
  const { theme, sound, motion, ambient, secretUnlocked } = useSettings()
  const KEY = 'portfolio:settings'

  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (typeof s.secretUnlocked === 'boolean') secretUnlocked.value = s.secretUnlocked
      const themes = ['green', 'amber', 'blue']
      if (secretUnlocked.value) themes.push('synthwave')
      if (themes.includes(s.theme)) theme.value = s.theme
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

  watch([theme, sound, motion, ambient, secretUnlocked], () => {
    apply()
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          theme: theme.value,
          sound: sound.value,
          motion: motion.value,
          ambient: ambient.value,
          secretUnlocked: secretUnlocked.value,
        }),
      )
    } catch {
      /* localStorage indisponible */
    }
  })
})
