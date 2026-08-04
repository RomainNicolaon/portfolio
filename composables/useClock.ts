export function useClock() {
  const time = ref('--:--:--')
  let timer: ReturnType<typeof setInterval> | undefined

  const update = () => {
    time.value = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { time }
}
