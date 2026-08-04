<script setup lang="ts">
const { profile } = usePortfolio()

const done = ref(false)
const lines = ref<string[]>([])
let timers: ReturnType<typeof setTimeout>[] = []

const boot = [
  `booting portfolio.os v3.0 …`,
  `[  OK  ] mounting /home/${profile.handle}`,
  `[  OK  ] loading modules: vue nuxt tailwind three`,
  `[  OK  ] starting network services`,
  `[  OK  ] rendering interface`,
  `welcome, ${profile.name.toLowerCase()} ▮`,
]

function finish() {
  done.value = true
  timers.push(setTimeout(() => sessionStorage.setItem('booted', '1'), 100))
}

onMounted(() => {
  // Une seule fois par session, et jamais en mode animations réduites.
  if (sessionStorage.getItem('booted') || isReducedMotion()) {
    done.value = true
    return
  }

  let delay = 0
  boot.forEach((line, i) => {
    delay += i === 0 ? 120 : 260 + Math.random() * 160
    timers.push(setTimeout(() => lines.value.push(line), delay))
  })
  timers.push(setTimeout(finish, delay + 650))
})

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div v-if="!done || lines.length" class="boot" :class="{ 'is-done': done }" aria-hidden="true">
    <div class="w-full max-w-lg px-6 font-mono text-sm">
      <p v-for="(line, i) in lines" :key="i" class="text-term-green">
        {{ line }}
      </p>
    </div>
  </div>
</template>
