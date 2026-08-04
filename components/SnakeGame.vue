<script setup lang="ts">
const arcade = useArcade()
const { theme } = useSettings()
const sound = useSound()

const COLS = 24
const ROWS = 16
const SPEED = 110 // ms par tick

type Cell = { x: number; y: number }

const snake = ref<Cell[]>([{ x: 8, y: 8 }])
const dir = ref<Cell>({ x: 1, y: 0 })
const nextDir = ref<Cell>({ x: 1, y: 0 })
const food = ref<Cell>({ x: 14, y: 8 })
const score = ref(0)
const best = ref(0)
const over = ref(false)
const started = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

function randFood(): Cell {
  let c: Cell
  do {
    c = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (snake.value.some((s) => s.x === c.x && s.y === c.y))
  return c
}

function reset() {
  snake.value = [{ x: 8, y: 8 }]
  dir.value = { x: 1, y: 0 }
  nextDir.value = { x: 1, y: 0 }
  food.value = randFood()
  score.value = 0
  over.value = false
  started.value = true
}

function tick() {
  if (over.value) return
  dir.value = nextDir.value
  const head = snake.value[0]
  const nx = head.x + dir.value.x
  const ny = head.y + dir.value.y

  if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || snake.value.some((s) => s.x === nx && s.y === ny)) {
    over.value = true
    best.value = Math.max(best.value, score.value)
    sound.err()
    return
  }

  const newHead = { x: nx, y: ny }
  const grew = nx === food.value.x && ny === food.value.y
  const body = [newHead, ...snake.value]
  if (grew) {
    score.value += 1
    food.value = randFood()
    sound.ok()
  } else {
    body.pop()
  }
  snake.value = body
}

function setDir(x: number, y: number) {
  // Interdit le demi-tour instantané.
  if (dir.value.x === -x && dir.value.y === -y) return
  nextDir.value = { x, y }
}

function onKey(e: KeyboardEvent) {
  const k = e.key.toLowerCase()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault()
  if (k === 'arrowup' || k === 'w' || k === 'z') setDir(0, -1)
  else if (k === 'arrowdown' || k === 's') setDir(0, 1)
  else if (k === 'arrowleft' || k === 'a' || k === 'q') setDir(-1, 0)
  else if (k === 'arrowright' || k === 'd') setDir(1, 0)
  else if (k === ' ' && over.value) reset()
  else if (k === 'escape') arcade.stop()
}

function grid(): string {
  const cells: string[] = []
  for (let y = 0; y < ROWS; y++) {
    let row = ''
    for (let x = 0; x < COLS; x++) {
      const isHead = snake.value[0].x === x && snake.value[0].y === y
      const isBody = snake.value.some((s, i) => i > 0 && s.x === x && s.y === y)
      const isFood = food.value.x === x && food.value.y === y
      if (isHead) row += '@'
      else if (isBody) row += 'o'
      else if (isFood) row += '*'
      else row += '·'
    }
    cells.push(row)
  }
  return cells.join('\n')
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
    aria-label="Jeu Snake"
  >
    <div class="w-full max-w-md rounded-lg border border-term-border bg-term-panel p-4 shadow-2xl shadow-black/60">
      <div class="mb-2 flex items-center justify-between text-xs text-term-dim">
        <span class="text-term-green">&gt;_ snake.exe</span>
        <span>score <b class="text-term-bright">{{ score }}</b> · record {{ best }}</span>
        <button
          type="button"
          class="rounded border border-term-border px-2 py-0.5 text-term-muted hover:border-term-green hover:text-term-bright"
          aria-label="Quitter le jeu"
          @click="arcade.stop()"
        >
          ✕ esc
        </button>
      </div>

      <div class="relative">
        <pre class="select-none text-center text-[11px] leading-[1.15] text-term-green sm:text-sm">{{ grid() }}</pre>
        <div
          v-if="over"
          class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-term-bg/85 text-center"
        >
          <p class="text-term-bright">game over — score {{ score }}</p>
          <button
            type="button"
            class="rounded border border-term-green px-3 py-1 text-sm text-term-bright hover:bg-term-green hover:text-term-bg"
            @click="reset"
          >
            rejouer (espace)
          </button>
        </div>
      </div>

      <p class="mt-2 text-center text-[11px] text-term-dim">
        ↑↓←→ / WASD pour diriger · espace pour rejouer · échap pour quitter
      </p>
    </div>
  </div>
</template>
