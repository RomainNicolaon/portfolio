<script setup lang="ts">
const route = useRoute()
const { profile, projects } = usePortfolio()
const { t } = useI18n()

definePageMeta({ key: (route) => route.fullPath })

const slug = String(route.params.slug)
const project = projects.find((p) => slugify(p.name) === slug)

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Projet introuvable', fatal: true })
}

const config = useRuntimeConfig()
const localePath = useLocalePath()
const base = (profile.website || config.public.siteUrl).replace(/\/$/, '')
const url = `${base}${localePath(`/projets/${slug}`)}`

const hasSource = !!project.links.source && project.status !== 'privé'
const hasDemo = !!project.links.demo && project.links.demo !== '#' && project.status !== 'privé'

useSeoMeta({
  title: t('projectPage.metaTitle', { name: project.name, author: profile.name }),
  description: project.description,
  ogTitle: project.name,
  ogDescription: project.description,
  ogUrl: url,
  ogType: 'article',
  ogImage: `${base}/og/${slug}.png`,
  twitterCard: 'summary_large_image',
  twitterImage: `${base}/og/${slug}.png`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: project.description,
        url,
        ...(hasSource ? { codeRepository: project.links.source } : {}),
        programmingLanguage: project.tags,
        author: { '@type': 'Person', name: profile.name, url: `${base}/` },
        dateCreated: project.year,
      }),
    },
  ],
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-16 sm:py-24">
    <nav class="reveal mb-8 text-sm text-term-dim">
      <NuxtLink :to="localePath('/')" class="transition-colors hover:text-term-bright">~</NuxtLink>
      <span class="px-1">/</span>
      <NuxtLink :to="localePath('/') + '#projects'" class="transition-colors hover:text-term-bright">{{
        t('projectPage.breadcrumbProjects')
      }}</NuxtLink>
      <span class="px-1">/</span>
      <span class="text-term-muted">{{ slug }}</span>
    </nav>

    <header class="mb-8">
      <p class="text-sm text-term-dim">
        <span class="text-term-green">$</span> cat ~/projects/{{ slug }}/README.md
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <h1 class="text-2xl font-bold text-term-bright sm:text-4xl">
          <span class="text-term-green">&gt;_</span> {{ project!.name }}
        </h1>
        <span
          class="rounded border border-term-border px-2 py-0.5 text-xs"
          :class="project!.status === 'actif' ? 'text-term-green' : 'text-term-dim'"
        >
          {{ t(`status.${project!.status}`) }}
        </span>
      </div>
      <p class="mt-2 text-sm text-term-dim">{{ t('projectPage.year', { year: project!.year }) }}</p>
    </header>

    <p class="text-term-muted">{{ project!.description }}</p>

    <div v-if="project!.tags.length" class="mt-6 flex flex-wrap gap-2">
      <span
        v-for="tag in project!.tags"
        :key="tag"
        class="rounded border border-term-border px-2 py-1 text-xs text-term-dim"
        >#{{ tag }}</span
      >
    </div>

    <div class="mt-8 flex flex-wrap gap-4 border-t border-term-border pt-6 text-sm">
      <a
        v-if="hasSource"
        :href="project!.links.source!"
        target="_blank"
        rel="noopener"
        class="rounded border border-term-border px-3 py-1.5 text-term-muted transition-colors hover:border-term-green hover:text-term-bright"
        >{{ t('projectPage.gitClone') }}</a
      >
      <a
        v-if="hasDemo"
        :href="project!.links.demo!"
        target="_blank"
        rel="noopener"
        class="rounded border border-term-green px-3 py-1.5 text-term-bright transition-colors hover:bg-term-green hover:text-term-bg"
        >{{ t('projectPage.demo') }}</a
      >
      <span v-if="!hasSource && !hasDemo" class="text-term-dim">{{ t('projectPage.private') }}</span>
    </div>

    <div class="mt-12">
      <NuxtLink :to="localePath('/') + '#projects'" class="text-sm text-term-dim transition-colors hover:text-term-bright"
        >{{ t('projectPage.back') }}</NuxtLink
      >
    </div>
  </main>
</template>
