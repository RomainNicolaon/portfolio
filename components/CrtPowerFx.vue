<script setup lang="ts">
// Rejoue une brève animation d'allumage CRT à chaque changement de thème.
const { theme } = useSettings()
const tick = ref(0)
const playing = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch(theme, () => {
  if (isReducedMotion()) return
  tick.value++
  playing.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    playing.value = false
  }, 600)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div v-if="playing" :key="tick" class="crt-power" aria-hidden="true" />
</template>
