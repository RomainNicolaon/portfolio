<script setup lang="ts">
const { profile } = usePortfolio()
const { time } = useClock()
const palette = useCommandPalette()

const open = ref(false)

const links = [
  { href: '#about', label: './about' },
  { href: '#experience', label: './experience' },
  { href: '#projects', label: './projects' },
  { href: '#skills', label: './skills' },
  { href: '#education', label: './education' },
  { href: '#faq', label: './faq' },
]
</script>

<template>
  <nav
    class="sticky top-0 z-40 border-b border-term-border bg-term-panel/90 backdrop-blur supports-[backdrop-filter]:bg-term-panel/70"
  >
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 text-sm">
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex items-center gap-1.5" aria-hidden="true">
          <span class="h-3 w-3 rounded-full bg-red-500/80" />
          <span class="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span class="h-3 w-3 rounded-full bg-term-green" />
        </span>
        <a href="#hero" class="truncate text-term-bright">
          <span class="text-term-dim">$</span> {{ profile.handle }}@{{ profile.host
          }}<span class="text-term-dim">:~</span>
        </a>
      </div>

      <ul class="hidden items-center gap-5 lg:flex">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" class="text-term-muted transition-colors hover:text-term-bright">{{
            link.label
          }}</a>
        </li>
        <li>
          <a
            href="#contact"
            class="rounded border border-term-green px-3 py-1 text-term-bright transition-colors hover:bg-term-green hover:text-term-bg"
            >./contact</a
          >
        </li>
      </ul>

      <div class="flex items-center gap-2">
        <div class="hidden items-center gap-2 text-xs text-term-dim lg:flex">
          <ClientOnly>
            <span>{{ time }}</span>
            <template #fallback><span>--:--:--</span></template>
          </ClientOnly>
        </div>
        <ClientOnly>
          <button
            type="button"
            class="hidden items-center gap-1 rounded border border-term-border px-2 py-1 text-xs text-term-muted transition-colors hover:border-term-green hover:text-term-bright sm:flex"
            aria-label="Ouvrir la palette de commandes"
            title="Palette de commandes (Ctrl+K)"
            @click="palette.toggle()"
          >
            <span class="text-term-green">&gt;_</span>
            <kbd class="font-mono">Ctrl K</kbd>
          </button>
        </ClientOnly>
        <ClientOnly>
          <SettingsMenu />
        </ClientOnly>
        <button
          type="button"
          class="rounded border border-term-border px-2 py-1 text-term-muted transition-colors hover:border-term-green hover:text-term-bright lg:hidden"
          :aria-expanded="open"
          aria-label="Menu de navigation"
          @click="open = !open"
        >
          {{ open ? '✕' : '≡' }} menu
        </button>
      </div>
    </div>

    <div v-if="open" class="border-t border-term-border bg-term-panel lg:hidden">
      <ul class="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="block rounded px-2 py-2 text-term-muted transition-colors hover:bg-term-bg/60 hover:text-term-bright"
            @click="open = false"
            >{{ link.label }}</a
          >
        </li>
        <li>
          <a
            href="#contact"
            class="mt-1 block rounded border border-term-green px-2 py-2 text-center text-term-bright transition-colors hover:bg-term-green hover:text-term-bg"
            @click="open = false"
            >./contact</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>
