<script setup lang="ts">
import * as THREE from 'three'

const el = ref<HTMLElement | null>(null)

let frameId = 0
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let group: THREE.Group | null = null
let spinner: THREE.Group | null = null
let dust: THREE.Points | null = null
const disposables: { dispose: () => void }[] = []
const pointer = { x: 0, y: 0 }

function onPointerMove(e: PointerEvent) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1
}

function onResize() {
  const container = el.value
  if (!renderer || !camera || !container) return
  const w = container.clientWidth
  const h = container.clientHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

onMounted(() => {
  const container = el.value
  if (!container || typeof window === 'undefined') return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const w = container.clientWidth
  const h = container.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
  camera.position.z = 5.5

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(w, h)
  container.appendChild(renderer.domElement)

  group = new THREE.Group()
  spinner = new THREE.Group()
  group.add(spinner)
  scene.add(group)

  const geo = new THREE.IcosahedronGeometry(1.9, 1)
  disposables.push(geo)

  const edges = new THREE.EdgesGeometry(geo)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.55,
  })
  spinner.add(new THREE.LineSegments(edges, lineMat))
  disposables.push(edges, lineMat)

  const pointsMat = new THREE.PointsMaterial({ color: 0x4ade80, size: 0.07 })
  spinner.add(new THREE.Points(geo, pointsMat))
  disposables.push(pointsMat)

  const dustGeo = new THREE.BufferGeometry()
  const count = 240
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 16
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const dustMat = new THREE.PointsMaterial({
    color: 0x22c55e,
    size: 0.03,
    transparent: true,
    opacity: 0.45,
  })
  dust = new THREE.Points(dustGeo, dustMat)
  scene.add(dust)
  disposables.push(dustGeo, dustMat)

  window.addEventListener('resize', onResize)
  if (!reduce) window.addEventListener('pointermove', onPointerMove)

  const render = () => {
    if (!renderer || !scene || !camera || !spinner || !group) return
    spinner.rotation.y += 0.003
    spinner.rotation.x += 0.0012
    group.rotation.y += (pointer.x * 0.5 - group.rotation.y) * 0.05
    group.rotation.x += (pointer.y * 0.5 - group.rotation.x) * 0.05
    if (dust) dust.rotation.y += 0.0004
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(render)
  }

  if (reduce) renderer.render(scene, camera)
  else render()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointerMove)
  disposables.forEach((d) => d.dispose())
  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
  }
  renderer = scene = camera = group = spinner = dust = null
})
</script>

<template>
  <div
    ref="el"
    class="pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
    aria-hidden="true"
  />
</template>
