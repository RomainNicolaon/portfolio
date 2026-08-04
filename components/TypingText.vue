<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    phrases: string[]
    typeSpeed?: number
    deleteSpeed?: number
    holdTime?: number
    loop?: boolean
  }>(),
  {
    typeSpeed: 55,
    deleteSpeed: 28,
    holdTime: 1600,
    loop: true,
  },
)

const text = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    text.value = props.phrases[0] || ''
    return
  }

  let phraseIndex = 0
  let charIndex = 0
  let deleting = false

  const tick = () => {
    const current = props.phrases[phraseIndex] || ''

    if (!deleting) {
      charIndex++
      text.value = current.slice(0, charIndex)
      if (charIndex === current.length) {
        if (!props.loop && phraseIndex === props.phrases.length - 1) return
        deleting = true
        timer = setTimeout(tick, props.holdTime)
        return
      }
      timer = setTimeout(tick, props.typeSpeed)
      return
    }

    charIndex--
    text.value = current.slice(0, charIndex)
    if (charIndex === 0) {
      deleting = false
      phraseIndex = (phraseIndex + 1) % props.phrases.length
      timer = setTimeout(tick, props.typeSpeed)
      return
    }
    timer = setTimeout(tick, props.deleteSpeed)
  }

  tick()
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <span class="type-cursor">{{ text }}</span>
</template>
