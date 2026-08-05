import * as fr from '~/data/portfolio'
import * as en from '~/data/portfolio.en'

export function useSiteSeo() {
  const config = useRuntimeConfig()
  const { locale, locales, t } = useI18n()

  const data = locale.value === 'en' ? en : fr
  const { profile, education, experiences, faq, skills } = data

  const localeMeta = (unref(locales) as { code: string; language?: string }[]).find(
    (l) => l.code === locale.value,
  )
  const lang = localeMeta?.language || (locale.value === 'en' ? 'en-US' : 'fr-FR')

  const base = (profile.website || config.public.siteUrl).replace(/\/$/, '')
  const homePath = locale.value === 'en' ? '/en' : '/'

  const seoName = profile.name
  const nameParts = seoName.split(/\s+/).filter(Boolean)
  const givenName = nameParts[0] || ''
  const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  // Renforce l'association patronyme ↔ entité pour Google (recherche par nom de famille).
  const alternateName = Array.from(
    new Set(
      [seoName, givenName && familyName ? `${familyName} ${givenName}` : ''].filter(Boolean),
    ),
  )
  const seoTitle = profile.title ? `${seoName} — ${profile.title}` : seoName
  const baseDescription = profile.about[0] || profile.taglines[0] || 'Portfolio'
  // Garantit la présence du nom dans le snippet SERP (utile pour la requête « nom de famille »).
  const nameIsPresent = familyName
    ? baseDescription.toLowerCase().includes(familyName.toLowerCase())
    : baseDescription.toLowerCase().includes(seoName.toLowerCase())
  const seoDescription = nameIsPresent ? baseDescription : `${seoTitle}. ${baseDescription}`
  const seoUrl = `${base}${homePath}`
  const seoImage = `${base}/og-image.png`
  const seoImageAlt = t('seo.ogImageAlt', { title: seoTitle, name: seoName })

  const socialUrls = profile.socials.map((s) => s.url).filter(Boolean)
  const sameAs = Array.from(new Set([...socialUrls, ...(profile.sameAs ?? [])].filter(Boolean)))
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
      ...(givenName ? { givenName } : {}),
      ...(familyName ? { familyName } : {}),
      ...(alternateName.length ? { alternateName } : {}),
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
    keywords: [seoName, ...alternateName, ...knowsAbout.slice(0, 12)]
      .filter(Boolean)
      .join(', '),
    ogType: 'profile',
    ogSiteName: seoName,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogImage: seoImage,
    ogImageAlt: seoImageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
    twitterImage: seoImage,
    twitterImageAlt: seoImageAlt,
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
