<script setup lang="ts">
const matrix = useMatrix()
const arcade = useArcade()
const palette = useCommandPalette()
const { t } = useI18n()

const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
useHead(() => {
  const h = i18nHead.value
  return {
    htmlAttrs: { lang: h.htmlAttrs?.lang },
    link: h.link,
    meta: h.meta,
  }
})

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    palette.toggle()
    return
  }
  if (e.key === 'Escape') {
    matrix.stop()
    arcade.stop()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <div class="scanlines" aria-hidden="true" />
    <div class="crt-vignette" aria-hidden="true" />
    <div class="crt-flicker" aria-hidden="true" />
    <ClientOnly>
      <CursorGlow />
      <BootSequence />
      <div
        v-if="matrix.active.value"
        class="fixed inset-0 z-[46] cursor-pointer bg-term-bg/80"
        role="button"
        tabindex="0"
        :aria-label="t('matrix.close')"
        @click="matrix.stop()"
      >
        <MatrixRain />
        <p class="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-term-dim">
          {{ t('matrix.hint') }}
        </p>
      </div>
      <SnakeGame v-if="arcade.active.value === 'snake'" />
      <TetrisGame v-if="arcade.active.value === 'tetris'" />
      <BreakoutGame v-if="arcade.active.value === 'breakout'" />
      <PongGame v-if="arcade.active.value === 'pong'" />
      <CommandPalette />
      <AppToast />
      <CrtPowerFx />
      <StatusBar />
    </ClientOnly>

    <TheNav />

    <NuxtPage />

    <TheFooter />
  </div>
</template>
