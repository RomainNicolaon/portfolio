<script setup lang="ts">
const { profile } = usePortfolio()
</script>

<template>
  <section id="about" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
      <header class="reveal mb-8">
        <p class="text-sm text-term-dim">
          <span class="text-term-green">$</span> cat about.txt
        </p>
        <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">
          <ScrambleText text="// À propos" />
        </h2>
      </header>

      <div class="reveal grid gap-8 md:grid-cols-3">
        <div class="space-y-4 md:col-span-2">
          <p
            v-for="(paragraph, i) in profile.about"
            :key="i"
            class="leading-relaxed text-term-muted"
          >
            {{ paragraph }}
          </p>
        </div>

        <aside class="rounded-lg border border-term-border bg-term-panel p-5 text-sm">
          <p class="mb-3 text-term-dim">// info</p>
          <dl class="space-y-2">
            <div class="flex justify-between gap-4">
              <dt class="text-term-dim">name</dt>
              <dd class="text-term-bright">{{ profile.name }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-term-dim">role</dt>
              <dd class="text-right text-term-muted">{{ profile.title }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-term-dim">location</dt>
              <dd class="text-right text-term-muted">{{ profile.location }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-term-dim">status</dt>
              <dd :class="profile.available ? 'text-term-green' : 'text-term-muted'">
                {{ profile.available ? 'ouvert aux opportunités' : 'indisponible' }}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <div class="mt-8">
        <ClientOnly>
          <GithubStats />
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
