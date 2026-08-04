<script setup lang="ts">
const props = withDefaults(
  defineProps<{ value: number; suffix?: string; label: string; duration?: number }>(),
  { suffix: '', duration: 1200 },
)

const display = ref(0)
const el = ref<HTMLElement | null>(null)
let started = false

function animate() {
  if (started) return
  started = true
  if (isReducedMotion()) {
    display.value = props.value
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - t, 3)
    display.value = Math.round(eased * props.value)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  if (!el.value) return
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        animate()
        obs.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  obs.observe(el.value)
  onBeforeUnmount(() => obs.disconnect())
})
</script>

<template>
  <div ref="el" class="rounded-lg border border-term-border bg-term-panel p-5 text-center">
    <p class="text-3xl font-bold text-term-bright">
      <span class="text-term-green">{{ display }}</span>{{ suffix }}
    </p>
    <p class="mt-1 text-xs text-term-dim">{{ label }}</p>
  </div>
</template>
