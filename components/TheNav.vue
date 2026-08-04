<script setup lang="ts">
const { profile } = usePortfolio()
const { time } = useClock()

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
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 text-sm">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1.5" aria-hidden="true">
          <span class="h-3 w-3 rounded-full bg-red-500/80" />
          <span class="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span class="h-3 w-3 rounded-full bg-term-green" />
        </span>
        <a href="#hero" class="text-term-bright">
          <span class="text-term-dim">$</span> {{ profile.handle }}@{{ profile.host
          }}<span class="text-term-dim">:~</span>
        </a>
      </div>

      <ul class="hidden items-center gap-5 md:flex">
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

      <div class="hidden items-center gap-2 text-xs text-term-dim sm:flex md:hidden lg:flex">
        <ClientOnly>
          <span>{{ time }}</span>
          <template #fallback><span>--:--:--</span></template>
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>
