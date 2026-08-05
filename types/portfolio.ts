export interface Social {
  label: string
  url: string
  command: string
}

export interface Profile {
  name: string
  handle: string
  host: string
  title: string
  taglines: string[]
  location: string
  website: string
  available: boolean
  about: string[]
  email: string
  resume: string
  socials: Social[]
  /**
   * Profils publics supplémentaires (X, dev.to, Malt, Stack Overflow, about.me…) injectés
   * dans le `sameAs` du schema Person/Organization, sans être affichés dans l'UI.
   * N'ajouter que des profils réels et vérifiés — renforce l'entité aux yeux de Google.
   */
  sameAs?: string[]
}

export interface Experience {
  role: string
  company: string
  url: string
  period: string
  location: string
  description: string
  highlights: string[]
  stack: string[]
}

export type ProjectStatus = 'actif' | 'archivé' | 'privé' | string

export interface Project {
  name: string
  description: string
  year: string
  status: ProjectStatus
  tags: string[]
  links: {
    demo: string | null
    source: string | null
  }
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}
