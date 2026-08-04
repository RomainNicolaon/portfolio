<script setup lang="ts">
const glow = ref<HTMLElement | null>(null)
let enabled = false

function onMove(e: PointerEvent) {
  const node = glow.value
  if (!node) return
  node.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
  node.style.opacity = '1'
}

function onLeave() {
  if (glow.value) glow.value.style.opacity = '0'
}

onMounted(() => {
  // Uniquement pointeur fin (souris) et animations autorisées.
  const fine = window.matchMedia('(pointer: fine)').matches
  if (!fine || isReducedMotion()) return
  enabled = true
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerout', onLeave, { passive: true })
})

onBeforeUnmount(() => {
  if (!enabled) return
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerout', onLeave)
})
</script>

<template>
  <div ref="glow" class="cursor-glow" style="opacity: 0" aria-hidden="true" />
</template>
