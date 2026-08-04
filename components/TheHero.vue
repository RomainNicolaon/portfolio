<script setup lang="ts">
const { profile } = usePortfolio()
const taglines = profile.taglines.length ? profile.taglines : [profile.title]
</script>

<template>
  <section id="hero" class="grid-bg relative overflow-hidden">
    <MatrixRain />
    <div class="relative z-10 mx-auto flex min-h-[85vh] max-w-5xl flex-col justify-center px-4 py-20">
      <div
        class="max-w-3xl rounded-lg border border-term-border bg-term-panel/60 p-6 shadow-2xl shadow-black/40 sm:p-8"
      >
        <div
          class="mb-6 flex items-center gap-1.5 border-b border-term-border pb-3"
          aria-hidden="true"
        >
          <span class="h-3 w-3 rounded-full bg-red-500/80" />
          <span class="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span class="h-3 w-3 rounded-full bg-term-green" />
          <span class="ml-3 text-xs text-term-dim"
            >{{ profile.handle }}@{{ profile.host }}: ~/whoami</span
          >
        </div>

        <p class="text-sm text-term-dim"><span class="text-term-green">$</span> whoami</p>

        <h1
          class="glitch mt-3 text-4xl font-extrabold text-term-bright text-glow sm:text-6xl"
          :data-text="`Portfolio ${profile.name}`"
        >
          Portfolio {{ profile.name }}
        </h1>

        <p class="mt-3 text-lg text-term-muted sm:text-2xl">
          <span class="text-term-dim">&gt;</span> {{ profile.title }}
        </p>

        <p class="mt-6 text-sm text-term-dim">
          <span class="text-term-green">$</span> ./run --tagline
        </p>
        <p class="mt-2 min-h-[1.75rem] text-base text-term-bright sm:text-lg">
          <TypingText :phrases="taglines" />
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-4 text-sm">
          <a
            href="#projects"
            class="rounded border border-term-green bg-term-green/10 px-4 py-2 text-term-bright transition-colors hover:bg-term-green hover:text-term-bg"
          >
            ls ./projects
          </a>
          <a
            v-if="profile.resume && profile.resume !== '#'"
            :href="profile.resume"
            target="_blank"
            rel="noopener"
            class="rounded border border-term-border px-4 py-2 text-term-muted transition-colors hover:border-term-green hover:text-term-bright"
          >
            cat cv.pdf
          </a>
          <a
            href="#contact"
            class="rounded border border-term-border px-4 py-2 text-term-muted transition-colors hover:border-term-green hover:text-term-bright"
          >
            ./contact.sh
          </a>
          <span
            v-if="profile.available"
            class="flex items-center gap-2 text-xs text-term-green"
          >
            <span class="h-2 w-2 animate-pulse rounded-full bg-term-green" />
            disponible
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
