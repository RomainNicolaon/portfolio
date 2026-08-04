<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const code = computed(() => props.error?.statusCode || 404)
const message = computed(() =>
  code.value === 404 ? 'command not found' : props.error?.message || 'erreur système',
)

useHead({ title: `${code.value} — ${message.value}` })
</script>

<template>
  <div class="grid-bg flex min-h-screen items-center justify-center px-4">
    <div class="scanlines" aria-hidden="true" />
    <div class="crt-vignette" aria-hidden="true" />

    <div class="w-full max-w-lg rounded-lg border border-term-border bg-term-panel/70 p-6 shadow-2xl shadow-black/40 sm:p-8">
      <div class="mb-6 flex items-center gap-1.5 border-b border-term-border pb-3" aria-hidden="true">
        <span class="h-3 w-3 rounded-full bg-red-500/80" />
        <span class="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span class="h-3 w-3 rounded-full bg-term-green" />
        <span class="ml-3 text-xs text-term-dim">error.log</span>
      </div>

      <p class="text-sm text-term-dim"><span class="text-term-green">$</span> cd {{ $route?.fullPath || '/?' }}</p>
      <h1 class="glitch mt-3 text-5xl font-extrabold text-term-bright text-glow" :data-text="String(code)">
        {{ code }}
      </h1>
      <p class="mt-3 text-term-muted">
        <span class="text-red-400/80">bash:</span> {{ message }}
      </p>

      <NuxtLink
        to="/"
        class="mt-8 inline-block rounded border border-term-green bg-term-green/10 px-4 py-2 text-sm text-term-bright transition-colors hover:bg-term-green hover:text-term-bg"
      >
        cd ~/
      </NuxtLink>
    </div>
  </div>
</template>
