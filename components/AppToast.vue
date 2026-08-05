<script setup lang="ts">
const { toasts, dismiss } = useToast()
const { theme } = useSettings()
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col gap-2"
    :data-theme="theme"
    role="status"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <button
        v-for="tst in toasts"
        :key="tst.id"
        type="button"
        class="pointer-events-auto flex max-w-xs items-start gap-3 rounded-lg border border-term-green bg-term-panel/95 px-4 py-3 text-left shadow-2xl shadow-black/60 backdrop-blur"
        @click="dismiss(tst.id)"
      >
        <span class="mt-0.5 text-term-green" aria-hidden="true">★</span>
        <span>
          <span class="block text-sm text-term-bright">{{ tst.text }}</span>
          <span v-if="tst.hint" class="mt-0.5 block text-xs text-term-dim">{{ tst.hint }}</span>
        </span>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
