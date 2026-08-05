export type Theme = 'green' | 'amber' | 'blue' | 'synthwave'
export type MotionPref = 'auto' | 'reduced'

// Thèmes visibles par défaut dans les réglages.
export const THEMES: { id: Theme; label: string }[] = [
  { id: 'green', label: 'green' },
  { id: 'amber', label: 'amber' },
  { id: 'blue', label: 'blue' },
]

// Thème « secret » débloqué via le Konami code.
export const SECRET_THEME: { id: Theme; label: string } = { id: 'synthwave', label: 'synthwave' }

export function useSettings() {
  const theme = useState<Theme>('settings:theme', () => 'green')
  const sound = useState<boolean>('settings:sound', () => false)
  const motion = useState<MotionPref>('settings:motion', () => 'auto')
  const ambient = useState<boolean>('settings:ambient', () => false)
  // Le thème synthwave reste caché tant qu'il n'a pas été débloqué.
  const secretUnlocked = useState<boolean>('settings:secretUnlocked', () => false)
  return { theme, sound, motion, ambient, secretUnlocked }
}
