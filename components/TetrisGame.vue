<script setup lang="ts">
const arcade = useArcade()
const { theme } = useSettings()
const sound = useSound()
const { t } = useI18n()

const COLS = 10
const ROWS = 20
const SPEED = 650 // ms par descente

type Grid = number[][]
type Shape = number[][]

const SHAPES: Shape[] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
]

function emptyBoard(): Grid {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0))
}

const board = ref<Grid>(emptyBoard())
const piece = ref<Shape>(SHAPES[0])
const px = ref(3)
const py = ref(0)
const score = ref(0)
const best = ref(0)
const over = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

function randPiece(): Shape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)].map((r) => [...r])
}

function rotate(s: Shape): Shape {
  const rows = s.length
  const cols = s[0].length
  const out: Shape = Array.from({ length: cols }, () => Array.from({ length: rows }, () => 0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[c][rows - 1 - r] = s[r][c]
    }
  }
  return out
}

function collides(s: Shape, ox: number, oy: number): boolean {
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (!s[r][c]) continue
      const x = ox + c
      const y = oy + r
      if (x < 0 || x >= COLS || y >= ROWS) return true
      if (y >= 0 && board.value[y][x]) return true
    }
  }
  return false
}

function spawn() {
  piece.value = randPiece()
  px.value = Math.floor((COLS - piece.value[0].length) / 2)
  py.value = 0
  if (collides(piece.value, px.value, py.value)) {
    over.value = true
    best.value = Math.max(best.value, score.value)
    sound.err()
  }
}

function lock() {
  const s = piece.value
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (s[r][c] && py.value + r >= 0) board.value[py.value + r][px.value + c] = 1
    }
  }
  clearLines()
  spawn()
}

function clearLines() {
  let cleared = 0
  board.value = board.value.filter((row) => {
    if (row.every((cell) => cell)) {
      cleared++
      return false
    }
    return true
  })
  while (board.value.length < ROWS) {
    board.value.unshift(Array.from({ length: COLS }, () => 0))
  }
  if (cleared) {
    score.value += [0, 100, 300, 500, 800][cleared] ?? cleared * 100
    sound.ok()
  }
}

function step() {
  if (over.value) return
  if (!collides(piece.value, px.value, py.value + 1)) {
    py.value += 1
  } else {
    lock()
  }
}

function move(dx: number) {
  if (over.value) return
  if (!collides(piece.value, px.value + dx, py.value)) px.value += dx
}

function tryRotate() {
  if (over.value) return
  const r = rotate(piece.value)
  // Wall kick basique : essaie sur place, puis décalé.
  for (const dx of [0, -1, 1, -2, 2]) {
    if (!collides(r, px.value + dx, py.value)) {
      piece.value = r
      px.value += dx
      return
    }
  }
}

function hardDrop() {
  if (over.value) return
  while (!collides(piece.value, px.value, py.value + 1)) py.value += 1
  lock()
}

function reset() {
  board.value = emptyBoard()
  score.value = 0
  over.value = false
  spawn()
}

function onKey(e: KeyboardEvent) {
  const k = e.key.toLowerCase()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault()
  if (k === 'arrowleft' || k === 'a' || k === 'q') move(-1)
  else if (k === 'arrowright' || k === 'd') move(1)
  else if (k === 'arrowdown' || k === 's') step()
  else if (k === 'arrowup' || k === 'w' || k === 'z') tryRotate()
  else if (k === ' ') {
    if (over.value) reset()
    else hardDrop()
  } else if (k === 'escape') arcade.stop()
}

function grid(): string {
  const view: Grid = board.value.map((row) => [...row])
  const s = piece.value
  if (!over.value) {
    for (let r = 0; r < s.length; r++) {
      for (let c = 0; c < s[r].length; c++) {
        const y = py.value + r
        const x = px.value + c
        if (s[r][c] && y >= 0 && y < ROWS && x >= 0 && x < COLS) view[y][x] = 2
      }
    }
  }
  return view
    .map((row) => row.map((cell) => (cell === 2 ? '[]' : cell ? '##' : ' .')).join(''))
    .join('\n')
}

onMounted(() => {
  reset()
  timer = setInterval(step, SPEED)
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
    :aria-label="t('arcade.tetrisTitle')"
  >
    <div
      class="w-full max-w-xs rounded-lg border border-term-border bg-term-panel p-4 shadow-2xl shadow-black/60"
    >
      <div class="mb-2 flex items-center justify-between text-xs text-term-dim">
        <span class="text-term-green">&gt;_ tetris.exe</span>
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
          class="select-none text-center text-[12px] leading-[1.05] text-term-green sm:text-sm"
        >{{ grid() }}</pre>
        <div
          v-if="over"
          class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-term-bg/85 text-center"
        >
          <p class="text-term-bright">{{ t('arcade.gameOver') }} — {{ score }}</p>
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
        {{ t('arcade.tetrisHelp') }}
      </p>
    </div>
  </div>
</template>
