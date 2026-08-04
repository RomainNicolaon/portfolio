import * as fr from '~/data/portfolio'
import * as en from '~/data/portfolio.en'

export function usePortfolio() {
  const { locale } = useI18n()
  const data = locale.value === 'en' ? en : fr
  return {
    profile: data.profile,
    experiences: data.experiences,
    projects: data.projects,
    skills: data.skills,
    education: data.education,
    faq: data.faq,
  }
}
