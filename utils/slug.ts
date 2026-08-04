import { projects } from '~/data/portfolio'
import type { Project } from '~/types/portfolio'

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function projectSlug(p: Project): string {
  return slugify(p.name)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => slugify(p.name) === slug)
}
