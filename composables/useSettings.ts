export type Theme =
  | 'green'
  | 'amber'
  | 'blue'
  | 'dracula'
  | 'nord'
  | 'solarized'
  | 'synthwave'
export type MotionPref = 'auto' | 'reduced'

// Thèmes visibles par défaut dans les réglages.
export const THEMES: { id: Theme; label: string }[] = [
  { id: 'green', label: 'green' },
  { id: 'amber', label: 'amber' },
  { id: 'blue', label: 'blue' },
  { id: 'dracula', label: 'dracula' },
  { id: 'nord', label: 'nord' },
  { id: 'solarized', label: 'solarized' },
]

// Thème « secret » débloqué via le Konami code.
export const SECRET_THEME: { id: Theme; label: string } = { id: 'synthwave', label: 'synthwave' }

export function useSettings() {
  const theme = useState<Theme>('settings:theme', () => 'green')
  const sound = useState<boolean>('settings:sound', () => false)
  const motion = useState<MotionPref>('settings:motion', () => 'auto')
  const ambient = useState<boolean>('settings:ambient', () => false)
  // Barre de statut façon tmux en bas d'écran (activée par défaut).
  const statusbar = useState<boolean>('settings:statusbar', () => true)
  // Le thème synthwave reste caché tant qu'il n'a pas été débloqué.
  const secretUnlocked = useState<boolean>('settings:secretUnlocked', () => false)
  return { theme, sound, motion, ambient, statusbar, secretUnlocked }
}
