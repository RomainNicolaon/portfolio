<script setup lang="ts">
const { theme, sound, motion, ambient, secretUnlocked } = useSettings()
const { click } = useSound()
const { t } = useI18n()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

// Ajoute le thème secret à la liste une fois débloqué via le Konami code.
const themeList = computed(() => (secretUnlocked.value ? [...THEMES, SECRET_THEME] : THEMES))

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
  <div ref="root" class="relative shrink-0">
    <button
      type="button"
      class="inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded border border-term-border px-2 text-xs text-term-muted transition-colors hover:border-term-green hover:text-term-bright"
      :aria-expanded="open"
      :aria-label="t('settings.aria')"
      :title="t('settings.title')"
      @click.stop="toggleMenu"
    >
      ⚙ cfg
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-50 mt-3 w-64 rounded-lg border border-term-border bg-term-panel p-5 text-xs shadow-2xl shadow-black/50"
    >
      <div class="mb-5">
        <p class="mb-2.5 text-term-dim">{{ t('settings.theme') }}</p>
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="th in themeList"
            :key="th.id"
            type="button"
            class="min-w-[3.5rem] flex-1 rounded border px-2 py-1.5 transition-colors"
            :class="
              theme === th.id
                ? 'border-term-green text-term-bright'
                : 'border-term-border text-term-muted hover:border-term-green'
            "
            @click.stop="setTheme(th.id)"
          >
            {{ th.label }}
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded border border-term-border px-3 py-2.5 text-term-muted transition-colors hover:border-term-green"
          @click.stop="toggleSound"
        >
          <span>{{ t('settings.sound') }}</span>
          <span :class="sound ? 'text-term-green' : 'text-term-dim'">{{ sound ? t('settings.on') : t('settings.off') }}</span>
        </button>

        <button
          type="button"
          class="flex w-full items-center justify-between rounded border border-term-border px-3 py-2.5 text-term-muted transition-colors hover:border-term-green"
          @click.stop="toggleMotion"
        >
          <span>{{ t('settings.animations') }}</span>
          <span :class="motion === 'reduced' ? 'text-term-dim' : 'text-term-green'">
            {{ motion === 'reduced' ? t('settings.reduced') : t('settings.on') }}
          </span>
        </button>

        <button
          type="button"
          class="flex w-full items-center justify-between rounded border border-term-border px-3 py-2.5 text-term-muted transition-colors hover:border-term-green"
          @click.stop="toggleAmbient"
        >
          <span>{{ t('settings.ambient') }}</span>
          <span :class="ambient ? 'text-term-green' : 'text-term-dim'">{{ ambient ? t('settings.on') : t('settings.off') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
