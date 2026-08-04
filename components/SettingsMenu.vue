<script setup lang="ts">
const { theme, sound, motion, ambient } = useSettings()
const { click } = useSound()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toggleMenu() {
  open.value = !open.value
  click()
}

function setTheme(id: Theme) {
  theme.value = id
  click()
}

function toggleSound() {
  sound.value = !sound.value
  if (sound.value) click()
}

function toggleMotion() {
  motion.value = motion.value === 'reduced' ? 'auto' : 'reduced'
  click()
}

function toggleAmbient() {
  ambient.value = !ambient.value
  click()
}

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="rounded border border-term-border px-2 py-1 text-term-muted transition-colors hover:border-term-green hover:text-term-bright"
      :aria-expanded="open"
      aria-label="Réglages d'affichage"
      title="Réglages"
      @click.stop="toggleMenu"
    >
      ⚙ cfg
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-50 mt-3 w-64 rounded-lg border border-term-border bg-term-panel p-5 text-xs shadow-2xl shadow-black/50"
    >
      <div class="mb-5">
        <p class="mb-2.5 text-term-dim">// thème</p>
        <div class="flex gap-2.5">
          <button
            v-for="t in THEMES"
            :key="t.id"
            type="button"
            class="flex-1 rounded border px-2 py-1.5 transition-colors"
            :class="
              theme === t.id
                ? 'border-term-green text-term-bright'
                : 'border-term-border text-term-muted hover:border-term-green'
            "
            @click.stop="setTheme(t.id)"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded border border-term-border px-3 py-2.5 text-term-muted transition-colors hover:border-term-green"
          @click.stop="toggleSound"
        >
          <span>son</span>
          <span :class="sound ? 'text-term-green' : 'text-term-dim'">{{ sound ? 'on' : 'off' }}</span>
        </button>

        <button
          type="button"
          class="flex w-full items-center justify-between rounded border border-term-border px-3 py-2.5 text-term-muted transition-colors hover:border-term-green"
          @click.stop="toggleMotion"
        >
          <span>animations</span>
          <span :class="motion === 'reduced' ? 'text-term-dim' : 'text-term-green'">
            {{ motion === 'reduced' ? 'réduites' : 'on' }}
          </span>
        </button>

        <button
          type="button"
          class="flex w-full items-center justify-between rounded border border-term-border px-3 py-2.5 text-term-muted transition-colors hover:border-term-green"
          @click.stop="toggleAmbient"
        >
          <span>ambiance CRT</span>
          <span :class="ambient ? 'text-term-green' : 'text-term-dim'">{{ ambient ? 'on' : 'off' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
