import { profile, projects } from '~/data/portfolio'
import { slugify } from '~/utils/slug'

// Flux RSS des projets (utile pour agrégateurs et référencement).
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const base = (profile.website || config.public.siteUrl).replace(/\/$/, '')

  const esc = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const items = projects
    .map((p) => {
      const link = `${base}/projets/${slugify(p.name)}`
      return `    <item>
      <title>${esc(p.name)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(p.tags.join(', '))}</category>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(profile.name)} — Projets</title>
    <link>${base}/</link>
    <description>Projets et réalisations de ${esc(profile.name)}, ${esc(profile.title)}.</description>
    <language>fr-FR</language>
${items}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
