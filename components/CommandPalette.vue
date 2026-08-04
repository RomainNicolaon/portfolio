<script setup lang="ts">
const { profile } = usePortfolio()
const palette = useCommandPalette()
const { theme } = useSettings()
const matrix = useMatrix()
const arcade = useArcade()
const { t } = useI18n()

interface Cmd {
  id: string
  label: string
  hint?: string
  run: () => void
}

function go(hash: string) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else location.hash = hash
}

const commands = computed<Cmd[]>(() => [
  { id: 'about', label: t('palette.goTo', { section: './about' }), hint: t('palette.hintSection'), run: () => go('#about') },
  { id: 'experience', label: t('palette.goTo', { section: './experience' }), hint: t('palette.hintSection'), run: () => go('#experience') },
  { id: 'projects', label: t('palette.goTo', { section: './projects' }), hint: t('palette.hintSection'), run: () => go('#projects') },
  { id: 'skills', label: t('palette.goTo', { section: './skills' }), hint: t('palette.hintSection'), run: () => go('#skills') },
  { id: 'education', label: t('palette.goTo', { section: './education' }), hint: t('palette.hintSection'), run: () => go('#education') },
  { id: 'faq', label: t('palette.goTo', { section: './faq' }), hint: t('palette.hintSection'), run: () => go('#faq') },
  { id: 'contact', label: t('palette.goTo', { section: './contact' }), hint: t('palette.hintSection'), run: () => go('#contact') },
  {
    id: 'theme',
    label: t('palette.theme', { theme: theme.value }),
    hint: t('palette.hintAction'),
    run: () => {
      const order = ['green', 'amber', 'blue'] as const
      theme.value = order[(order.indexOf(theme.value) + 1) % order.length]
    },
  },
  { id: 'matrix', label: t('palette.matrix'), hint: t('palette.hintFun'), run: () => matrix.start(7000) },
  { id: 'snake', label: t('palette.snake'), hint: t('palette.hintFun'), run: () => arcade.start('snake') },
  {
    id: 'resume',
    label: t('palette.resume'),
    hint: t('palette.hintAction'),
    run: () => window.open(profile.resume, '_blank', 'noopener'),
  },
  {
    id: 'github',
    label: t('palette.github'),
    hint: t('palette.hintLink'),
    run: () => window.open('https://github.com/RomainNicolaon', '_blank', 'noopener'),
  },
])

const query = ref('')
const selected = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter((c) => c.label.toLowerCase().includes(q) || c.id.includes(q))
})

watch(query, () => (selected.value = 0))
watch(
  () => palette.open.value,
  (v) => {
    if (v) {
      query.value = ''
      selected.value = 0
      nextTick(() => inputEl.value?.focus())
    }
  },
)

function exec(cmd?: Cmd) {
  const c = cmd || filtered.value[selected.value]
  if (!c) return
  palette.close()
  c.run()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selected.value = Math.min(filtered.value.length - 1, selected.value + 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selected.value = Math.max(0, selected.value - 1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    exec()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    palette.close()
  }
}
</script>

<template>
  <div
    v-if="palette.open.value"
    class="fixed inset-0 z-[60] flex items-start justify-center bg-term-bg/80 p-4 pt-[12vh]"
    @click.self="palette.close()"
  >
    <div
      class="w-full max-w-lg overflow-hidden rounded-lg border border-term-border bg-term-panel shadow-2xl shadow-black/60"
      role="dialog"
      :aria-label="t('palette.aria')"
    >
      <div class="flex items-center gap-2 border-b border-term-border px-3 py-2">
        <span class="text-term-green">&gt;_</span>
        <input
          ref="inputEl"
          v-model="query"
          type="text"
          class="term-input w-full border-0 bg-transparent p-0 text-sm text-term-bright placeholder:text-term-dim focus:outline-none focus:ring-0"
          :placeholder="t('palette.placeholder')"
          autocomplete="off"
          spellcheck="false"
          :aria-label="t('palette.searchAria')"
          @keydown="onKeydown"
        />
        <kbd class="hidden rounded border border-term-border px-1.5 py-0.5 text-[10px] text-term-dim sm:inline">esc</kbd>
      </div>
      <ul class="max-h-72 overflow-y-auto py-1 text-sm">
        <li v-if="!filtered.length" class="px-4 py-3 text-term-dim">{{ t('palette.empty') }}</li>
        <li
          v-for="(cmd, i) in filtered"
          :key="cmd.id"
          class="flex cursor-pointer items-center justify-between px-4 py-2"
          :class="i === selected ? 'bg-term-green/15 text-term-bright' : 'text-term-muted'"
          @mouseenter="selected = i"
          @click="exec(cmd)"
        >
          <span>{{ cmd.label }}</span>
          <span v-if="cmd.hint" class="text-[10px] text-term-dim">{{ cmd.hint }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
