<script setup lang="ts">
const props = defineProps<{ text: string }>()

const CHARS = '!<>-_\\/[]{}—=+*^?#01'
const el = ref<HTMLElement | null>(null)
const display = ref(props.text)
let raf = 0

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function scrambled(source: string) {
  return source
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : randomChar()))
    .join('')
}

function decode() {
  const final = props.text
  const queue = final.split('').map((ch, i) => ({
    ch,
    revealAt: i + Math.floor(Math.random() * 16) + 4,
  }))
  let frame = 0

  const tick = () => {
    let out = ''
    let done = 0
    for (const item of queue) {
      if (item.ch === ' ') {
        out += ' '
        done++
      } else if (frame >= item.revealAt) {
        out += item.ch
        done++
      } else {
        out += randomChar()
      }
    }
    display.value = out
    frame++
    if (done < queue.length) raf = requestAnimationFrame(tick)
    else display.value = final
  }
  tick()
}

onMounted(() => {
  const node = el.value
  if (!node) return
  if (isReducedMotion() || !('IntersectionObserver' in window)) {
    display.value = props.text
    return
  }

  display.value = scrambled(props.text)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          decode()
          observer.disconnect()
        }
      })
    },
    { threshold: 0.5 },
  )
  observer.observe(node)
})

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span ref="el">{{ display }}</span>
</template>
