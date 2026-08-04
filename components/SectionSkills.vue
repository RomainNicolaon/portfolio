<script setup lang="ts">
const { skills } = usePortfolio()
const { t } = useI18n()
</script>

<template>
  <section id="skills" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
      <header class="reveal mb-10">
        <p class="text-sm text-term-dim">
          <span class="text-term-green">$</span> cat skills.md
        </p>
        <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">
          <ScrambleText :text="t('sections.skills')" />
        </h2>
      </header>

      <div class="grid gap-5 sm:grid-cols-2">
        <div
          v-for="(group, i) in skills"
          :key="i"
          class="reveal rounded-lg border border-term-border bg-term-panel p-5"
        >
          <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-term-bright">
            <span class="text-term-green">##</span>
            {{ group.category }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(item, j) in group.items"
              :key="j"
              class="rounded border border-term-border bg-term-green/5 px-2.5 py-1 text-xs text-term-muted transition-colors hover:border-term-green hover:text-term-bright"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
