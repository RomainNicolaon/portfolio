<script setup lang="ts">
const { experiences } = usePortfolio()
</script>

<template>
  <section id="experience" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
      <header class="reveal mb-10">
        <p class="text-sm text-term-dim">
          <span class="text-term-green">$</span> cat experiences.json
        </p>
        <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">
          <ScrambleText text="// Expériences" />
        </h2>
      </header>

      <div class="relative space-y-6 border-l border-term-border pl-6 sm:pl-8">
        <article
          v-for="(job, i) in experiences"
          :key="i"
          class="reveal relative rounded-lg border border-term-border bg-term-panel p-5 transition-colors hover:border-term-dim"
        >
          <span
            class="absolute -left-[calc(1.5rem+7px)] top-6 h-3.5 w-3.5 rounded-full border-2 border-term-bg bg-term-green sm:-left-[calc(2rem+7px)]"
          />

          <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
            <h3 class="text-lg font-bold text-term-bright">
              {{ job.role }}
              <span class="text-term-dim">@</span>
              <a :href="job.url || '#'" class="text-term-green hover:underline">{{
                job.company
              }}</a>
            </h3>
            <span class="whitespace-nowrap text-xs text-term-dim">{{ job.period }}</span>
          </div>

          <p class="mt-1 text-xs text-term-dim">{{ job.location }}</p>
          <p class="mt-3 text-sm text-term-muted">{{ job.description }}</p>

          <ul v-if="job.highlights.length" class="mt-3 space-y-1.5 text-sm text-term-muted">
            <li v-for="(highlight, h) in job.highlights" :key="h" class="flex gap-2">
              <span class="text-term-green">▹</span>
              <span>{{ highlight }}</span>
            </li>
          </ul>

          <div v-if="job.stack.length" class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="(tech, t) in job.stack"
              :key="t"
              class="rounded border border-term-border px-2 py-0.5 text-xs text-term-dim"
              >{{ tech }}</span
            >
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
