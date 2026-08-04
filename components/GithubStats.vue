<script setup lang="ts">
const { profile } = usePortfolio()

const gh = profile.socials.find((s) => /github\.com/i.test(s.url))
const username = gh ? gh.url.replace(/\/+$/, '').split('/').pop() : ''

interface Stats {
  repos: number
  stars: number
  followers: number
}

const stats = ref<Stats | null>(null)
const failed = ref(false)

onMounted(async () => {
  if (!username) return
  try {
    const user = await $fetch<{ public_repos: number; followers: number }>(
      `https://api.github.com/users/${username}`,
    )
    const repos = await $fetch<{ stargazers_count: number; fork: boolean }[]>(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    )
    const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    stats.value = {
      repos: user.public_repos,
      stars,
      followers: user.followers,
    }
  } catch {
    failed.value = true
  }
})

const items = computed(() =>
  stats.value
    ? [
        { label: 'repos', value: stats.value.repos },
        { label: 'stars', value: stats.value.stars },
        { label: 'followers', value: stats.value.followers },
      ]
    : [],
)
</script>

<template>
  <div v-if="username && !failed" class="reveal">
    <p class="text-sm text-term-dim">
      <span class="text-term-green">$</span> gh stats --user {{ username }}
    </p>
    <div class="mt-3 grid grid-cols-3 gap-3">
      <div
        v-for="item in (stats ? items : [{ label: 'repos', value: -1 }, { label: 'stars', value: -1 }, { label: 'followers', value: -1 }])"
        :key="item.label"
        class="rounded-lg border border-term-border bg-term-panel p-4 text-center"
      >
        <p class="text-2xl font-bold text-term-bright text-glow tabular-nums">
          <span v-if="item.value >= 0">{{ item.value }}</span>
          <span v-else class="text-term-dim">…</span>
        </p>
        <p class="mt-1 text-xs text-term-dim">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>
