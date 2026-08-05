// Génère les favicons (PNG + ICO) à partir de public/favicon.svg, au build.
// Aucune dépendance au runtime : les fichiers sont écrits dans public/ puis
// copiés dans .output/public par Nuxt.
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(root, 'public')
const svgPath = resolve(publicDir, 'favicon.svg')

const svg = await readFile(svgPath)

// PNG à différentes tailles à partir du SVG source.
const pngTargets = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-48x48.png', size: 48 },
  { file: 'favicon-96x96.png', size: 96 },
  { file: 'apple-touch-icon.png', size: 180 },
]

const buffers = {}
for (const { file, size } of pngTargets) {
  const buf = await sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  buffers[size] = buf
  await writeFile(resolve(publicDir, file), buf)
}

// Icônes PWA référencées par public/site.webmanifest (installabilité + maskable).
// L'icône maskable ajoute une marge pour survivre au recadrage de la « safe zone ».
const bg = '#0a0e0a'
const pwaTargets = [
  { file: 'icon-192.png', size: 192, padding: 0 },
  { file: 'icon-512.png', size: 512, padding: 0 },
  { file: 'icon-maskable-512.png', size: 512, padding: 96 },
]

for (const { file, size, padding } of pwaTargets) {
  const inner = size - padding * 2
  const glyph = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: glyph, gravity: 'center' }])
    .png()
    .toFile(resolve(publicDir, file))
}

// favicon.ico multi-tailles (16/32/48) pour la requête /favicon.ico des navigateurs.
const ico = await pngToIco([buffers[16], buffers[32], buffers[48]])
await writeFile(resolve(publicDir, 'favicon.ico'), ico)

console.log('✓ Favicons générés :', pngTargets.map((t) => t.file).join(', '), '+ favicon.ico')
console.log('✓ Icônes PWA générées :', pwaTargets.map((t) => t.file).join(', '))
