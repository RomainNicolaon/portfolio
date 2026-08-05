<script setup lang="ts">
type Particle = {
  id: number
  char: string
  style: Record<string, string>
}

type ThemeToken = '--c-green' | '--c-bright' | '--c-neon' | '--c-dim'

const glyphs = '01<>[]{}/*+=$#_—'
const themeTokens: ThemeToken[] = ['--c-green', '--c-bright', '--c-neon', '--c-dim']
const particles = ref<Particle[]>([])

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min
function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

onMounted(() => {
  if (isReducedMotion()) return

  particles.value = Array.from({ length: 32 }, (_, id) => {
    const alpha = randomBetween(0.08, 0.2).toFixed(2)
    const token = pick(themeTokens)

    return {
      id,
      char: glyphs[Math.floor(Math.random() * glyphs.length)] ?? '0',
      style: {
        left: `${randomBetween(0, 100).toFixed(2)}%`,
        fontSize: `${randomBetween(10, 22).toFixed(1)}px`,
        animationDuration: `${randomBetween(18, 38).toFixed(1)}s`,
        animationDelay: `${randomBetween(-38, 0).toFixed(1)}s`,
        color: `rgb(var(${token}) / ${alpha})`,
        '--particle-drift': `${randomBetween(-36, 36).toFixed(1)}px`,
        '--particle-rise': `${randomBetween(90, 190).toFixed(1)}px`,
        '--particle-peak-opacity': alpha,
      },
    }
  })
})
</script>

<template>
  <div
    v-if="particles.length"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="hero-particle"
      :style="particle.style"
    >
      {{ particle.char }}
    </span>
  </div>
</template>

<style scoped>
.hero-particle {
  position: absolute;
  bottom: -2rem;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  line-height: 1;
  text-shadow: 0 0 0.75rem currentcolor;
  user-select: none;
  opacity: 0;
  animation-name: hero-particle-drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
}

@keyframes hero-particle-drift {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }

  18% {
    opacity: var(--particle-peak-opacity);
  }

  72% {
    opacity: var(--particle-peak-opacity);
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--particle-drift), calc(var(--particle-rise) * -1), 0) rotate(12deg);
  }
}
</style>
