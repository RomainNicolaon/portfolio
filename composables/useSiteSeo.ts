import * as fr from '~/data/portfolio'
import * as en from '~/data/portfolio.en'

export function useSiteSeo() {
  const config = useRuntimeConfig()
  const { locale, locales } = useI18n()

  const data = locale.value === 'en' ? en : fr
  const { profile, education, experiences, faq, skills } = data

  const localeMeta = (unref(locales) as { code: string; language?: string }[]).find(
    (l) => l.code === locale.value,
  )
  const lang = localeMeta?.language || (locale.value === 'en' ? 'en-US' : 'fr-FR')

  const base = (profile.website || config.public.siteUrl).replace(/\/$/, '')
  const homePath = locale.value === 'en' ? '/en' : '/'

  const seoName = profile.name
  const seoTitle = profile.title ? `${seoName} — ${profile.title}` : seoName
  const seoDescription = profile.about[0] || profile.taglines[0] || 'Portfolio'
  const seoUrl = `${base}${homePath}`
  const seoImage = `${base}/og-image.png`

  const sameAs = profile.socials.map((s) => s.url).filter(Boolean)
  const knowsAbout = skills.flatMap((group) => group.items)

  const alumniOf = education
    .filter((edu) => edu.school)
    .map((edu) => ({ '@type': 'EducationalOrganization', name: edu.school }))

  const firstJob = experiences.find((exp) => exp.company)
  const worksFor = firstJob
    ? {
        '@type': 'Organization',
        name: firstJob.company,
        ...(firstJob.url ? { url: firstJob.url, sameAs: [firstJob.url] } : {}),
      }
    : undefined

  let address: Record<string, string> | undefined
  if (profile.location) {
    const parts = profile.location.split(',').map((p) => p.trim())
    address = {
      '@type': 'PostalAddress',
      ...(parts[0] ? { addressLocality: parts[0] } : {}),
      ...(parts[1] ? { addressCountry: parts[1] } : {}),
    }
  }

  const faqEntities = faq
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      url: `${base}/`,
      name: seoTitle,
      description: seoDescription,
      inLanguage: lang,
      publisher: { '@id': `${base}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${base}/#organization`,
      name: seoName,
      url: `${base}/`,
      logo: seoImage,
      image: seoImage,
      founder: { '@id': `${base}/#person` },
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@type': 'ProfilePage',
      '@id': `${seoUrl}#profilepage`,
      url: seoUrl,
      name: seoTitle,
      description: seoDescription,
      inLanguage: lang,
      isPartOf: { '@id': `${base}/#website` },
      mainEntity: { '@id': `${base}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${base}/#person`,
      name: seoName,
      url: `${base}/`,
      ...(profile.title ? { jobTitle: profile.title } : {}),
      ...(profile.about[0] ? { description: profile.about[0] } : {}),
      ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
      image: seoImage,
      ...(address ? { address } : {}),
      ...(worksFor ? { worksFor } : {}),
      ...(alumniOf.length ? { alumniOf } : {}),
      ...(knowsAbout.length ? { knowsAbout } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
  ]

  if (faqEntities.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${seoUrl}#faq`,
      inLanguage: lang,
      isPartOf: { '@id': `${base}/#website` },
      mainEntity: faqEntities,
    })
  }

  const structuredData = { '@context': 'https://schema.org', '@graph': graph }

  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    author: seoName,
    keywords: knowsAbout.slice(0, 15).join(', '),
    ogType: 'profile',
    ogSiteName: seoName,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogImage: seoImage,
    twitterCard: 'summary_large_image',
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
    twitterImage: seoImage,
  })

  useHead({
    meta: [{ property: 'profile:first_name', content: seoName.split(' ')[0] || '' }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData),
      },
    ],
  })
}
