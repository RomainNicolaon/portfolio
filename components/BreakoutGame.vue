<script setup lang="ts">
const arcade = useArcade()
const { theme } = useSettings()
const sound = useSound()
const { t } = useI18n()

const COLS = 22
const ROWS = 16
const SPEED = 90 // ms par tick
const PADDLE_W = 5
const BRICK_ROWS = 4

const paddleX = ref(Math.floor((COLS - PADDLE_W) / 2))
const ball = ref({ x: COLS / 2, y: ROWS - 3, dx: 1, dy: -1 })
const bricks = ref<boolean[][]>([])
const score = ref(0)
const best = ref(0)
const over = ref(false)
const won = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

function buildBricks() {
  bricks.value = Array.from({ length: BRICK_ROWS }, () =>
    Array.from({ length: COLS }, () => true),
  )
}

function reset() {
  buildBricks()
  paddleX.value = Math.floor((COLS - PADDLE_W) / 2)
  ball.value = { x: Math.floor(COLS / 2), y: ROWS - 3, dx: Math.random() < 0.5 ? -1 : 1, dy: -1 }
  score.value = 0
  over.value = false
  won.value = false
}

function bricksLeft(): number {
  return bricks.value.reduce((n, row) => n + row.filter(Boolean).length, 0)
}

function tick() {
  if (over.value) return
  const b = ball.value
  let nx = b.x + b.dx
  let ny = b.y + b.dy

  // Rebonds sur les murs latéraux et le plafond.
  if (nx < 0 || nx >= COLS) {
    b.dx = -b.dx
    nx = b.x + b.dx
  }
  if (ny < 0) {
    b.dy = -b.dy
    ny = b.y + b.dy
  }

  // Collision avec une brique.
  if (ny >= 0 && ny < BRICK_ROWS && bricks.value[ny]?.[nx]) {
    bricks.value[ny][nx] = false
    b.dy = -b.dy
    ny = b.y + b.dy
    score.value += 10
    sound.ok()
    if (bricksLeft() === 0) {
      won.value = true
      over.value = true
      best.value = Math.max(best.value, score.value)
      return
    }
  }

  // Collision avec la raquette.
  if (ny >= ROWS - 1) {
    if (nx >= paddleX.value && nx < paddleX.value + PADDLE_W) {
      b.dy = -1
      // Angle selon le point d'impact.
      const hit = nx - (paddleX.value + PADDLE_W / 2)
      b.dx = hit < -0.5 ? -1 : hit > 0.5 ? 1 : b.dx
      ny = b.y - 1
    } else {
      over.value = true
      best.value = Math.max(best.value, score.value)
      sound.err()
      return
    }
  }

  b.x = Math.max(0, Math.min(COLS - 1, nx))
  b.y = ny
}

function movePaddle(dx: number) {
  paddleX.value = Math.max(0, Math.min(COLS - PADDLE_W, paddleX.value + dx))
}

function onKey(e: KeyboardEvent) {
  const k = e.key.toLowerCase()
  if (['arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault()
  if (k === 'arrowleft' || k === 'a' || k === 'q') movePaddle(-2)
  else if (k === 'arrowright' || k === 'd') movePaddle(2)
  else if (k === ' ' && over.value) reset()
  else if (k === 'escape') arcade.stop()
}

function grid(): string {
  const rows: string[] = []
  for (let y = 0; y < ROWS; y++) {
    let row = ''
    for (let x = 0; x < COLS; x++) {
      if (y < BRICK_ROWS && bricks.value[y]?.[x]) row += '#'
      else if (Math.round(ball.value.x) === x && ball.value.y === y) row += 'O'
      else if (y === ROWS - 1 && x >= paddleX.value && x < paddleX.value + PADDLE_W) row += '='
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
    :aria-label="t('arcade.breakoutTitle')"
  >
    <div
      class="w-full max-w-md rounded-lg border border-term-border bg-term-panel p-4 shadow-2xl shadow-black/60"
    >
      <div class="mb-2 flex items-center justify-between text-xs text-term-dim">
        <span class="text-term-green">&gt;_ breakout.exe</span>
        <span>score <b class="text-term-bright">{{ score }}</b> · {{ t('arcade.best') }} {{ best }}</span>
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
            {{ won ? t('arcade.win') : t('arcade.gameOver') }} — {{ score }}
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
        {{ t('arcade.breakoutHelp') }}
      </p>
    </div>
  </div>
</template>
