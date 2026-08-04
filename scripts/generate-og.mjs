// Génère une image OG (1200x630 PNG) par projet, au build. Aucune dépendance au runtime :
// les PNG sont écrits dans public/og/ puis copiés dans .output/public par Nuxt.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const jiti = createJiti(import.meta.url)

const { projects, profile } = await jiti.import(resolve(root, 'data/portfolio.ts'))

const slugify = (input) =>
  String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Découpe un texte en lignes d'au plus `max` caractères (approx. pour du monospace).
function wrap(text, max, maxLines) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      if (line) lines.push(line)
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
    if (lines.length >= maxLines) break
  }
  if (line && lines.length < maxLines) lines.push(line)
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/.{1}$/, '…')
  }
  return lines
}

const FONT = 'DejaVu Sans Mono, JetBrains Mono, Menlo, Consolas, monospace'

function svgFor(project) {
  const name = esc(project.name)
  const descLines = wrap(project.description || '', 52, 3)
  const tags = (project.tags || []).slice(0, 6).map((t) => `#${t}`).join('  ')
  const year = esc(project.year || '')

  const descTspans = descLines
    .map((l, i) => `<tspan x="80" y="${330 + i * 46}">${esc(l)}</tspan>`)
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0e0a"/>
  <rect x="0" y="0" width="1200" height="8" fill="#22c55e"/>
  <g font-family="${FONT}">
    <text x="80" y="120" font-size="26" fill="#3f8f4f">&gt;_ ${esc(profile.handle || 'romain')}@${esc(profile.host || 'portfolio')}:~$ cat projet</text>
    <text x="80" y="230" font-size="72" font-weight="800" fill="#e6ffe6">${name}</text>
    <text font-size="30" fill="#8faf8f">${descTspans}</text>
    <text x="80" y="500" font-size="26" fill="#3f8f4f">${esc(tags)}</text>
    <text x="80" y="575" font-size="24" fill="#6f8f6f">${year}</text>
    <text x="1120" y="575" font-size="24" fill="#6f8f6f" text-anchor="end">${esc((profile.website || '').replace(/^https?:\/\//, ''))}</text>
  </g>
</svg>`
}

const outDir = resolve(root, 'public/og')
await mkdir(outDir, { recursive: true })

let count = 0
for (const project of projects) {
  const svg = svgFor(project)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  await writeFile(resolve(outDir, `${slugify(project.name)}.png`), png)
  count++
}

console.log(`[og] ${count} images générées dans public/og/`)
