<script setup lang="ts">
const arcade = useArcade()
const { theme } = useSettings()
const sound = useSound()
const { t } = useI18n()

const COLS = 28
const ROWS = 14
const SPEED = 80 // ms par tick
const PADDLE_H = 4
const WIN_SCORE = 5

const leftY = ref(Math.floor((ROWS - PADDLE_H) / 2))
const rightY = ref(Math.floor((ROWS - PADDLE_H) / 2))
const ball = ref({ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2), dx: -1, dy: 1 })
const playerScore = ref(0)
const aiScore = ref(0)
const over = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

function serve(towardPlayer: boolean) {
  ball.value = {
    x: Math.floor(COLS / 2),
    y: Math.floor(ROWS / 2),
    dx: towardPlayer ? -1 : 1,
    dy: Math.random() < 0.5 ? -1 : 1,
  }
}

function reset() {
  playerScore.value = 0
  aiScore.value = 0
  over.value = false
  leftY.value = Math.floor((ROWS - PADDLE_H) / 2)
  rightY.value = Math.floor((ROWS - PADDLE_H) / 2)
  serve(Math.random() < 0.5)
}

function moveAI() {
  // Suit la balle avec une légère latence pour rester battable.
  const center = rightY.value + PADDLE_H / 2
  if (ball.value.dx > 0) {
    if (center < ball.value.y - 0.5 && rightY.value + PADDLE_H < ROWS) rightY.value += 1
    else if (center > ball.value.y + 0.5 && rightY.value > 0) rightY.value -= 1
  }
}

function point(forPlayer: boolean) {
  if (forPlayer) playerScore.value += 1
  else aiScore.value += 1
  sound.ok()
  if (playerScore.value >= WIN_SCORE || aiScore.value >= WIN_SCORE) {
    over.value = true
    return
  }
  serve(!forPlayer)
}

function tick() {
  if (over.value) return
  moveAI()
  const b = ball.value
  let nx = b.x + b.dx
  let ny = b.y + b.dy

  if (ny < 0 || ny >= ROWS) {
    b.dy = -b.dy
    ny = b.y + b.dy
  }

  // Raquette gauche (joueur).
  if (nx <= 1) {
    if (ny >= leftY.value && ny < leftY.value + PADDLE_H) {
      b.dx = 1
      nx = b.x + b.dx
    } else if (nx < 0) {
      point(false)
      return
    }
  }

  // Raquette droite (IA).
  if (nx >= COLS - 2) {
    if (ny >= rightY.value && ny < rightY.value + PADDLE_H) {
      b.dx = -1
      nx = b.x + b.dx
    } else if (nx >= COLS) {
      point(true)
      return
    }
  }

  b.x = Math.max(0, Math.min(COLS - 1, nx))
  b.y = Math.max(0, Math.min(ROWS - 1, ny))
}

function movePlayer(dy: number) {
  leftY.value = Math.max(0, Math.min(ROWS - PADDLE_H, leftY.value + dy))
}

function onKey(e: KeyboardEvent) {
  const k = e.key.toLowerCase()
  if (['arrowup', 'arrowdown', ' '].includes(k)) e.preventDefault()
  if (k === 'arrowup' || k === 'w' || k === 'z') movePlayer(-1)
  else if (k === 'arrowdown' || k === 's') movePlayer(1)
  else if (k === ' ' && over.value) reset()
  else if (k === 'escape') arcade.stop()
}

function grid(): string {
  const rows: string[] = []
  for (let y = 0; y < ROWS; y++) {
    let row = ''
    for (let x = 0; x < COLS; x++) {
      const isLeft = x === 0 && y >= leftY.value && y < leftY.value + PADDLE_H
      const isRight = x === COLS - 1 && y >= rightY.value && y < rightY.value + PADDLE_H
      const isBall = ball.value.x === x && ball.value.y === y
      if (isBall) row += 'O'
      else if (isLeft || isRight) row += '|'
      else if (x === Math.floor(COLS / 2)) row += ':'
      else row += ' '
    }
    rows.push(row)
  }
  return rows.join('\n')
}

onMounted(() => {
  reset()
  timer = setInterval(tick, SPEED)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div
    class="fixed inset-0 z-[55] flex items-center justify-center bg-term-bg/90 p-4"
    :data-theme="theme"
    role="dialog"
    :aria-label="t('arcade.pongTitle')"
  >
    <div
      class="w-full max-w-lg rounded-lg border border-term-border bg-term-panel p-4 shadow-2xl shadow-black/60"
    >
      <div class="mb-2 flex items-center justify-between text-xs text-term-dim">
        <span class="text-term-green">&gt;_ pong.exe</span>
        <span>
          {{ t('arcade.you') }} <b class="text-term-bright">{{ playerScore }}</b> ·
          <b class="text-term-bright">{{ aiScore }}</b> cpu
        </span>
        <button
          type="button"
          class="rounded border border-term-border px-2 py-0.5 text-term-muted hover:border-term-green hover:text-term-bright"
          :aria-label="t('arcade.quit')"
          @click="arcade.stop()"
        >
          ✕ esc
        </button>
      </div>

      <div class="relative">
        <pre
          class="select-none text-center text-[11px] leading-[1.15] text-term-green sm:text-sm"
        >{{ grid() }}</pre>
        <div
          v-if="over"
          class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-term-bg/85 text-center"
        >
          <p class="text-term-bright">
            {{ playerScore > aiScore ? t('arcade.win') : t('arcade.lose') }}
          </p>
          <button
            type="button"
            class="rounded border border-term-green px-3 py-1 text-sm text-term-bright hover:bg-term-green hover:text-term-bg"
            @click="reset"
          >
            {{ t('arcade.replay') }}
          </button>
        </div>
      </div>

      <p class="mt-2 text-center text-[11px] text-term-dim">
        {{ t('arcade.pongHelp') }}
      </p>
    </div>
  </div>
</template>
