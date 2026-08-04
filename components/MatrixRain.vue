<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let drops: number[] = []
let fontSize = 14
let width = 0
let height = 0

const GLYPHS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/\\[]{}#$%&*+=_'.split('')

function resize() {
  const el = canvas.value
  if (!el) return
  const parent = el.parentElement
  width = parent?.clientWidth ?? el.clientWidth
  height = parent?.clientHeight ?? el.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = width * dpr
  el.height = height * dpr
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  const columns = Math.ceil(width / fontSize)
  drops = new Array(columns).fill(0).map(() => Math.floor((Math.random() * height) / fontSize))
}

function draw() {
  if (!ctx) return
  ctx.fillStyle = 'rgba(10, 14, 10, 0.08)'
  ctx.fillRect(0, 0, width, height)
  ctx.font = `${fontSize}px "JetBrains Mono", monospace`

  for (let i = 0; i < drops.length; i++) {
    const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    const x = i * fontSize
    const y = drops[i] * fontSize

    ctx.fillStyle = Math.random() > 0.975 ? '#4ade80' : '#22c55e'
    ctx.fillText(char, x, y)

    if (y > height && Math.random() > 0.975) drops[i] = 0
    drops[i]++
  }
  raf = requestAnimationFrame(draw)
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = el.getContext('2d')
  if (!ctx) return

  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas
    ref="canvas"
    class="pointer-events-none absolute inset-0 h-full w-full opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]"
    aria-hidden="true"
  />
</template>
