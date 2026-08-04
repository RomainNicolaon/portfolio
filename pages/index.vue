<script setup lang="ts">
const { profile, experiences, projects, skills, education, faq } = usePortfolio()

useSiteSeo()
</script>

<template>
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
</template>
