<script setup lang="ts">
const { profile, experiences, projects, skills, education, faq } = usePortfolio()
const matrix = useMatrix()

useSiteSeo()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') matrix.stop()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <div class="scanlines" aria-hidden="true" />
    <div class="crt-vignette" aria-hidden="true" />
    <div class="crt-flicker" aria-hidden="true" />
    <ClientOnly>
      <CursorGlow />
      <BootSequence />
      <div
        v-if="matrix.active.value"
        class="fixed inset-0 z-[46] cursor-pointer bg-term-bg/80"
        role="button"
        tabindex="0"
        aria-label="Fermer l'effet Matrix"
        @click="matrix.stop()"
      >
        <MatrixRain />
        <p class="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-term-dim">
          échap / clic pour sortir
        </p>
      </div>
    </ClientOnly>

    <TheNav />

    <main>
      <TheHero />
      <SectionAbout v-if="profile.about.length" />
      <SectionExperience v-if="experiences.length" />
      <SectionProjects v-if="projects.length" />
      <SectionSkills v-if="skills.length" />
      <SectionEducation v-if="education.length" />
      <SectionFaq v-if="faq.length" />
      <SectionContact />
    </main>

    <TheFooter />
  </div>
</template>
