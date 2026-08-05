<script setup lang="ts">
const props = defineProps<{ text: string }>()

const CHARS = '!<>-_\\/[]{}—=+*^?#01'
const display = ref(props.text)
let raf = 0

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function cancelDecode() {
  if (!raf) return
  cancelAnimationFrame(raf)
  raf = 0
}

function decode() {
  cancelDecode()

  const final = props.text
  const maxFrame = 18
  const queue = final.split('').map((ch, i) => ({
    ch,
    revealAt: Math.min(
      maxFrame,
      Math.floor((i / Math.max(final.length - 1, 1)) * 14) + Math.floor(Math.random() * 5) + 2,
    ),
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

    if (done < queue.length) {
      raf = requestAnimationFrame(tick)
    } else {
      raf = 0
      display.value = final
    }
  }

  tick()
}

function onMouseenter() {
  cancelDecode()
  if (isReducedMotion()) {
    display.value = props.text
    return
  }
  decode()
}

watch(
  () => props.text,
  (text) => {
    cancelDecode()
    display.value = text
  },
)

onBeforeUnmount(cancelDecode)
</script>

<template>
  <span @mouseenter="onMouseenter">{{ display }}</span>
</template>
