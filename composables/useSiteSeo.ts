import { education, experiences, faq, profile, skills } from '~/data/portfolio'

export function useSiteSeo() {
  const config = useRuntimeConfig()
  const base = (profile.website || config.public.siteUrl).replace(/\/$/, '')

  const seoName = profile.name
  const seoTitle = profile.title ? `${seoName} — ${profile.title}` : seoName
  const seoDescription = profile.about[0] || profile.taglines[0] || 'Portfolio'
  const seoUrl = `${base}/`
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
      inLanguage: 'fr-FR',
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
      inLanguage: 'fr-FR',
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
      inLanguage: 'fr-FR',
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
    ogUrl: seoUrl,
    ogImage: seoImage,
    ogLocale: 'fr_FR',
    twitterCard: 'summary_large_image',
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
    twitterImage: seoImage,
  })

  useHead({
    link: [{ rel: 'canonical', href: seoUrl }],
    meta: [{ property: 'profile:first_name', content: seoName.split(' ')[0] || '' }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData),
      },
    ],
  })
}
