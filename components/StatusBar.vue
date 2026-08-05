<script setup lang="ts">
// Barre de statut façon tmux : heure live, thème actif, uptime session, FPS.
const { theme, statusbar } = useSettings()
const { profile } = usePortfolio()
const { time } = useClock()
const { t } = useI18n()

const uptime = ref('0:00')
const fps = ref(0)

let uptimeTimer: ReturnType<typeof setInterval> | undefined
let raf = 0
const start = Date.now()
let frames = 0
let last = start

function fmtUptime(ms: number) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function loop(now: number) {
  frames++
  if (now - last >= 1000) {
    fps.value = Math.round((frames * 1000) / (now - last))
    frames = 0
    last = now
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  uptime.value = fmtUptime(0)
  uptimeTimer = setInterval(() => {
    uptime.value = fmtUptime(Date.now() - start)
  }, 1000)
  if (!isReducedMotion()) raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  if (uptimeTimer) clearInterval(uptimeTimer)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div v-if="statusbar" class="status-bar" role="status" :aria-label="t('statusbar.aria')">
    <span class="status-seg text-term-green">
      <span aria-hidden="true">●</span> {{ profile.handle }}@{{ profile.host }}
    </span>
    <span class="status-seg">
      <span class="text-term-dim">theme</span>
      <span class="text-term-bright">{{ theme }}</span>
    </span>
    <span class="status-seg">
      <span class="text-term-dim">up</span>
      <ClientOnly>
        <span>{{ uptime }}</span>
        <template #fallback><span>0:00</span></template>
      </ClientOnly>
    </span>
    <span v-if="fps" class="status-seg hidden sm:inline-flex">
      <span class="text-term-dim">fps</span>
      <span :class="fps >= 50 ? 'text-term-green' : fps >= 30 ? 'text-term-bright' : 'text-term-muted'">{{ fps }}</span>
    </span>
    <span class="status-seg ml-auto text-term-muted">
      <ClientOnly>
        <span>{{ time }}</span>
        <template #fallback><span>--:--:--</span></template>
      </ClientOnly>
    </span>
  </div>
</template>
