export type ArcadeGame = 'snake' | 'tetris' | 'breakout' | 'pong' | null

// État global du mini-jeu affiché en overlay (déclenché depuis le terminal).
export function useArcade() {
  const active = useState<ArcadeGame>('arcade:active', () => null)

  function start(game: Exclude<ArcadeGame, null>) {
    active.value = game
    return true
  }

  function stop() {
    active.value = null
  }

  return { active, start, stop }
}
