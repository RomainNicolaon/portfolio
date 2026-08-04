<script setup lang="ts">
const { education } = usePortfolio()
</script>

<template>
  <section id="education" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
      <header class="reveal mb-10">
        <p class="text-sm text-term-dim">
          <span class="text-term-green">$</span> cat education.txt
        </p>
        <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">// Formation</h2>
      </header>

      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="(edu, i) in education"
          :key="i"
          class="reveal rounded-lg border border-term-border bg-term-panel p-5"
        >
          <div class="flex items-baseline justify-between gap-3">
            <h3 class="text-base font-bold text-term-bright">{{ edu.degree }}</h3>
            <span class="whitespace-nowrap text-xs text-term-dim">{{ edu.period }}</span>
          </div>
          <p class="mt-1 text-sm text-term-green">{{ edu.school }}</p>
          <p v-if="edu.description" class="mt-3 text-sm text-term-muted">{{ edu.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
