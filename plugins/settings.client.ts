// Applique les réglages (thème, mouvement) au DOM et les persiste en localStorage.
export default defineNuxtPlugin(() => {
  const { theme, sound, motion, ambient, statusbar, secretUnlocked } = useSettings()
  const KEY = 'portfolio:settings'

  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (typeof s.secretUnlocked === 'boolean') secretUnlocked.value = s.secretUnlocked
      const themes = ['green', 'amber', 'blue', 'dracula', 'nord', 'solarized']
      if (secretUnlocked.value) themes.push('synthwave')
      if (themes.includes(s.theme)) theme.value = s.theme
      if (typeof s.sound === 'boolean') sound.value = s.sound
      if (s.motion === 'auto' || s.motion === 'reduced') motion.value = s.motion
      if (typeof s.ambient === 'boolean') ambient.value = s.ambient
      if (typeof s.statusbar === 'boolean') statusbar.value = s.statusbar
    }
  } catch {
    /* localStorage indisponible */
  }

  const apply = () => {
    const el = document.documentElement
    el.dataset.theme = theme.value
    el.classList.toggle('motion-off', motion.value === 'reduced')
    el.classList.toggle('has-statusbar', statusbar.value)
  }

  apply()

  watch([theme, sound, motion, ambient, statusbar, secretUnlocked], () => {
    apply()
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          theme: theme.value,
          sound: sound.value,
          motion: motion.value,
          ambient: ambient.value,
          statusbar: statusbar.value,
          secretUnlocked: secretUnlocked.value,
        }),
      )
    } catch {
      /* localStorage indisponible */
    }
  })
})
