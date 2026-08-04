<script setup lang="ts">
const { projects } = usePortfolio()
const { t } = useI18n()
const localePath = useLocalePath()

const activeTag = ref<string | null>(null)

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const p of projects) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([tag]) => tag)
})

const filtered = computed(() =>
  activeTag.value ? projects.filter((p) => p.tags.includes(activeTag.value as string)) : projects,
)

function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag
}
</script>

<template>
  <section id="projects" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
      <header class="reveal mb-10">
        <p class="text-sm text-term-dim">
          <span class="text-term-green">$</span> ls -la ~/projects
        </p>
        <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">
          <ScrambleText :text="t('sections.projects')" />
        </h2>
      </header>

      <div class="reveal mb-8 flex flex-wrap items-center gap-2 text-xs">
        <span class="text-term-dim">grep --tag</span>
        <button
          type="button"
          class="rounded border px-2 py-1 transition-colors"
          :class="
            activeTag === null
              ? 'border-term-green text-term-bright'
              : 'border-term-border text-term-muted hover:border-term-green'
          "
          @click="activeTag = null"
        >
          all
        </button>
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="rounded border px-2 py-1 transition-colors"
          :class="
            activeTag === tag
              ? 'border-term-green text-term-bright'
              : 'border-term-border text-term-muted hover:border-term-green'
          "
          @click="toggleTag(tag)"
        >
          #{{ tag }}
        </button>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="project in filtered"
          :key="project.name"
          v-tilt
          class="card-3d group relative flex flex-col rounded-lg border border-term-border bg-term-panel p-5 transition-all hover:border-term-green hover:shadow-lg hover:shadow-term-green/10"
        >
          <NuxtLink
            :to="localePath(`/projets/${slugify(project.name)}`)"
            class="absolute inset-0 z-10 rounded-lg"
          >
            <span class="sr-only">{{ t('projects.detailFor', { name: project.name }) }}</span>
          </NuxtLink>
          <div class="flex items-start justify-between gap-3">
            <h3 class="flex items-center gap-2 text-lg font-bold text-term-bright">
              <span class="text-term-green">&gt;_</span>
              {{ project.name }}
            </h3>
            <span
              class="whitespace-nowrap rounded border border-term-border px-2 py-0.5 text-xs"
              :class="project.status === 'actif' ? 'text-term-green' : 'text-term-dim'"
            >
              {{ t(`status.${project.status}`) }}
            </span>
          </div>

          <p class="mt-3 flex-1 text-sm text-term-muted">{{ project.description }}</p>

          <div v-if="project.tags.length" class="mt-4 flex flex-wrap gap-2">
            <span v-for="(tag, ti) in project.tags" :key="ti" class="text-xs text-term-dim"
              >#{{ tag }}</span
            >
          </div>

          <div class="mt-4 flex items-center gap-4 border-t border-term-border pt-4 text-sm">
            <span class="text-xs text-term-dim">{{ project.year }}</span>
            <span class="flex-1" />
            <span
              class="font-medium text-term-green transition-colors group-hover:text-term-bright"
              aria-hidden="true"
              >{{ t('projects.detail') }}</span
            >
            <template v-if="project.status !== 'privé'">
              <a
                v-if="project.links.source"
                :href="project.links.source"
                class="relative z-20 text-term-muted transition-colors hover:text-term-bright"
                target="_blank"
                rel="noopener"
                >git clone</a
              >
              <a
                v-if="project.links.demo"
                :href="project.links.demo"
                class="relative z-20 text-term-green transition-colors hover:text-term-bright"
                target="_blank"
                rel="noopener"
                >./demo</a
              >
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
