export type Theme = 'green' | 'amber' | 'blue'
export type MotionPref = 'auto' | 'reduced'

export const THEMES: { id: Theme; label: string }[] = [
  { id: 'green', label: 'green' },
  { id: 'amber', label: 'amber' },
  { id: 'blue', label: 'blue' },
]

export function useSettings() {
  const theme = useState<Theme>('settings:theme', () => 'green')
  const sound = useState<boolean>('settings:sound', () => false)
  const motion = useState<MotionPref>('settings:motion', () => 'auto')
  const recruiter = useState<boolean>('settings:recruiter', () => false)
  const ambient = useState<boolean>('settings:ambient', () => false)
  return { theme, sound, motion, recruiter, ambient }
}
