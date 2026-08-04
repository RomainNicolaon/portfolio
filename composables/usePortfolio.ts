import {
  education,
  experiences,
  faq,
  profile,
  projects,
  skills,
} from '~/data/portfolio'

export function usePortfolio() {
  return {
    profile,
    experiences,
    projects,
    skills,
    education,
    faq,
  }
}
