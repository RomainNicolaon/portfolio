<script setup lang="ts">
const { profile } = usePortfolio()
const { t } = useI18n()

const turnstileSiteKey = String(useRuntimeConfig().public.turnstileSiteKey || '')
const turnstileToken = ref('')

if (import.meta.client && turnstileSiteKey) {
  const w = window as unknown as {
    onTurnstileVerify?: (t: string) => void
    onTurnstileExpire?: () => void
  }
  w.onTurnstileVerify = (t: string) => (turnstileToken.value = t)
  w.onTurnstileExpire = () => (turnstileToken.value = '')
  useHead({
    script: [
      { src: 'https://challenges.cloudflare.com/turnstile/v0/api.js', async: true, defer: true },
    ],
  })
}

const form = reactive({ name: '', email: '', message: '', website: '' })
const status = ref<'idle' | 'sending' | 'ok' | 'error'>('idle')
const errorMsg = ref('')

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function submit() {
  errorMsg.value = ''
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    status.value = 'error'
    errorMsg.value = t('contact.errFill')
    return
  }
  if (!emailRe.test(form.email)) {
    status.value = 'error'
    errorMsg.value = t('contact.errEmail')
    return
  }
  if (form.message.trim().length < 10) {
    status.value = 'error'
    errorMsg.value = t('contact.errShort')
    return
  }
  if (turnstileSiteKey && !turnstileToken.value) {
    status.value = 'error'
    errorMsg.value = t('contact.errTurnstile')
    return
  }

  status.value = 'sending'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        website: form.website,
        turnstileToken: turnstileToken.value,
      },
    })
    status.value = 'ok'
    form.name = form.email = form.message = ''
    turnstileToken.value = ''
    ;(window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset()
  } catch (e) {
    status.value = 'error'
    errorMsg.value =
      (e as { statusMessage?: string; data?: { statusMessage?: string; message?: string } })
        ?.data?.message ||
      (e as { data?: { statusMessage?: string } })?.data?.statusMessage ||
      t('contact.errGeneric')
    turnstileToken.value = ''
    ;(window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset()
  }
}
</script>

<template>
  <section id="contact" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
      <header class="reveal mb-8">
        <p class="text-sm text-term-dim">
          <span class="text-term-green">$</span> ./contact.sh
        </p>
        <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">
          <ScrambleText :text="t('sections.contact')" />
        </h2>
      </header>

      <div class="reveal grid gap-6 md:grid-cols-2">
        <div class="rounded-lg border border-term-border bg-term-panel p-6 sm:p-8">
          <p class="mb-6 text-term-muted">
            <span class="text-term-green">&gt;</span>
            {{ t('contact.intro') }}
          </p>

          <form class="space-y-4" novalidate @submit.prevent="submit">
            <div>
              <label for="c-name" class="mb-1 block text-xs text-term-dim">{{
                t('contact.name')
              }}</label>
              <input
                id="c-name"
                v-model="form.name"
                type="text"
                required
                maxlength="100"
                autocomplete="name"
                class="term-input w-full rounded border border-term-border bg-term-bg/60 px-3 py-2 text-sm text-term-bright placeholder:text-term-dim focus:border-term-green focus:outline-none"
                :placeholder="t('contact.namePlaceholder')"
              />
            </div>

            <div>
              <label for="c-email" class="mb-1 block text-xs text-term-dim">{{
                t('contact.email')
              }}</label>
              <input
                id="c-email"
                v-model="form.email"
                type="email"
                required
                maxlength="150"
                autocomplete="email"
                class="term-input w-full rounded border border-term-border bg-term-bg/60 px-3 py-2 text-sm text-term-bright placeholder:text-term-dim focus:border-term-green focus:outline-none"
                placeholder="ada@example.com"
              />
            </div>

            <div>
              <label for="c-message" class="mb-1 block text-xs text-term-dim">{{
                t('contact.message')
              }}</label>
              <textarea
                id="c-message"
                v-model="form.message"
                required
                rows="5"
                maxlength="5000"
                class="term-input w-full resize-y rounded border border-term-border bg-term-bg/60 px-3 py-2 text-sm text-term-bright placeholder:text-term-dim focus:border-term-green focus:outline-none"
                :placeholder="t('contact.messagePlaceholder')"
              />
            </div>

            <!-- Champ piège anti-spam : masqué aux humains -->
            <div class="absolute -left-[9999px]" aria-hidden="true">
              <label>Ne pas remplir<input v-model="form.website" type="text" tabindex="-1" autocomplete="off" /></label>
            </div>

            <div
              v-if="turnstileSiteKey"
              class="cf-turnstile"
              :data-sitekey="turnstileSiteKey"
              data-action="turnstile-spin-v2"
              data-theme="dark"
              data-callback="onTurnstileVerify"
              data-expired-callback="onTurnstileExpire"
            />

            <div class="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                :disabled="status === 'sending'"
                class="rounded border border-term-green bg-term-green/10 px-4 py-2 text-sm text-term-bright transition-colors hover:bg-term-green hover:text-term-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ status === 'sending' ? t('contact.sending') : t('contact.send') }}
              </button>

              <p v-if="status === 'ok'" class="text-sm text-term-green" role="status">
                {{ t('contact.ok') }}
              </p>
              <p v-else-if="status === 'error'" class="text-sm text-red-400/90" role="alert">
                {{ errorMsg }}
              </p>
            </div>
          </form>
        </div>

        <div class="flex flex-col rounded-lg border border-term-border bg-term-panel p-6 sm:p-8">
          <p class="text-xs text-term-dim">{{ t('contact.direct') }}</p>
          <a
            v-if="profile.email"
            :href="`mailto:${profile.email}`"
            class="mt-3 inline-flex items-center gap-2 text-sm text-term-bright transition-colors hover:text-term-green"
          >
            <span class="text-term-green">$</span> {{ profile.email }}
          </a>

          <div v-if="profile.socials.length" class="mt-8 border-t border-term-border pt-6">
            <p class="mb-4 text-xs text-term-dim">{{ t('contact.links') }}</p>
            <ul class="space-y-3">
              <li v-for="(social, i) in profile.socials" :key="i">
                <a
                  :href="social.url || '#'"
                  target="_blank"
                  rel="noopener"
                  class="group flex flex-col rounded border border-term-border p-3 transition-colors hover:border-term-green"
                >
                  <span class="text-sm text-term-bright">{{ social.label }}</span>
                  <span class="mt-1 text-xs text-term-dim">
                    <span class="text-term-green">$</span> {{ social.command }}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
