<script setup lang="ts">
const { profile, experiences, projects, skills, education, faq } = usePortfolio()

useSiteSeo()
</script>

<template>
  <div>
    <div class="scanlines" aria-hidden="true" />
    <div class="crt-vignette" aria-hidden="true" />
    <div class="crt-flicker" aria-hidden="true" />
    <ClientOnly>
      <CursorGlow />
      <BootSequence />
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
