<script setup lang="ts">
const { profile } = usePortfolio()
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-term-border bg-term-panel">
    <div class="mx-auto max-w-5xl px-4 py-8 text-sm text-term-dim">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p>
          <span class="text-term-green">$</span> echo "&copy; {{ year }} {{ profile.name }}"
        </p>
        <p class="text-xs">
          {{ t('footer.builtWith') }} <span class="text-term-green">Nuxt</span> ·
          <span class="text-term-green">Tailwind</span>
        </p>
      </div>
      <p class="mt-4 text-xs text-term-border">
        <span class="text-term-dim">process exited with code 0</span>
        <span class="cursor align-middle" />
      </p>
    </div>
  </footer>
</template>
