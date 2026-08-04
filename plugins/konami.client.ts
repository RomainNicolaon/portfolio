// Konami code (↑ ↑ ↓ ↓ ← → ← → B A) → déclenche l'effet Matrix.
export default defineNuxtPlugin(() => {
  const matrix = useMatrix()
  const sequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ]
  let pos = 0

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    pos = key === sequence[pos] ? pos + 1 : key === sequence[0] ? 1 : 0
    if (pos === sequence.length) {
      pos = 0
      matrix.start(9000)
    }
  })
})
