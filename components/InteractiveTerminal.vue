<script setup lang="ts">
const { profile, projects, skills, experiences, education } = usePortfolio()
const { theme } = useSettings()
const matrix = useMatrix()
const sound = useSound()

interface Line {
  text: string
  cls?: string
}

const prompt = `${profile.handle}@${profile.host}:~$`
const input = ref('')
const history = ref<string[]>([])
const histIndex = ref(-1)
const output = ref<Line[]>([
  { text: "Tape 'help' pour lister les commandes disponibles.", cls: 'text-term-dim' },
])
const scroller = ref<HTMLElement | null>(null)
const field = ref<HTMLInputElement | null>(null)

const COMMANDS = [
  'help',
  'about',
  'whoami',
  'projects',
  'skills',
  'experience',
  'education',
  'contact',
  'social',
  'resume',
  'theme',
  'matrix',
  'clear',
  'date',
]

function push(lines: Line[]) {
  output.value.push(...lines)
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
}

function run(raw: string) {
  const cmd = raw.trim()
  push([{ text: `${prompt} ${cmd}`, cls: 'text-term-muted' }])
  if (!cmd) return

  const [name, ...args] = cmd.split(/\s+/)
  const arg = args.join(' ')

  switch (name.toLowerCase()) {
    case 'help':
      push([
        { text: 'Commandes disponibles :', cls: 'text-term-bright' },
        { text: '  help        cette aide' },
        { text: '  about       qui suis-je' },
        { text: '  whoami      identité courte' },
        { text: '  projects    liste des projets' },
        { text: '  skills      compétences techniques' },
        { text: '  experience  parcours professionnel' },
        { text: '  education   formation' },
        { text: '  contact     email de contact' },
        { text: '  social      liens (GitHub, LinkedIn)' },
        { text: '  resume      télécharger le CV' },
        { text: '  theme <x>   green | amber | blue' },
        { text: '  matrix      « wake up, Neo… »' },
        { text: '  date        date et heure' },
        { text: '  clear       vider le terminal' },
      ])
      break
    case 'about':
      push(profile.about.map((t) => ({ text: t })))
      break
    case 'whoami':
      push([
        { text: profile.name, cls: 'text-term-bright' },
        { text: `${profile.title} · ${profile.location}` },
      ])
      break
    case 'projects':
      push([
        { text: `${projects.length} projets :`, cls: 'text-term-bright' },
        ...projects.map((p) => ({
          text: `  ${p.name} — ${p.tags.slice(0, 3).join(', ')} (${p.year})`,
        })),
        { text: "→ voir la section ./projects pour les détails", cls: 'text-term-dim' },
      ])
      break
    case 'skills':
      push(
        skills.flatMap((g) => [
          { text: `${g.category}`, cls: 'text-term-bright' },
          { text: `  ${g.items.join(', ')}` },
        ]),
      )
      break
    case 'experience':
      push(
        experiences.map((e) => ({ text: `  ${e.period} — ${e.role} @ ${e.company}` })),
      )
      break
    case 'education':
      push(
        education.map((e) => ({ text: `  ${e.period} — ${e.degree} @ ${e.school}` })),
      )
      break
    case 'contact':
      push([{ text: profile.email, cls: 'text-term-green' }])
      break
    case 'social':
      push(profile.socials.map((s) => ({ text: `  ${s.label}: ${s.url}`, cls: 'text-term-green' })))
      break
    case 'resume':
      if (profile.resume && profile.resume !== '#') {
        push([{ text: `Ouverture du CV… ${profile.resume}`, cls: 'text-term-green' }])
        window.open(profile.resume, '_blank', 'noopener')
      } else {
        push([{ text: 'CV indisponible.', cls: 'text-term-dim' }])
      }
      break
    case 'theme':
      if (arg === 'green' || arg === 'amber' || arg === 'blue') {
        theme.value = arg
        push([{ text: `thème → ${arg}`, cls: 'text-term-green' }])
      } else {
        push([{ text: 'usage: theme <green|amber|blue>', cls: 'text-term-dim' }])
      }
      break
    case 'matrix': {
      const started = matrix.start(7000)
      push([
        started
          ? { text: 'Wake up, Neo… (échap pour sortir)', cls: 'text-term-green' }
          : { text: 'Indisponible en mode animations réduites.', cls: 'text-term-dim' },
      ])
      break
    }
    case 'date':
      push([{ text: new Date().toLocaleString('fr-FR') }])
      break
    case 'clear':
      output.value = []
      return
    case 'sudo':
      push([{ text: `${profile.handle} n'est pas dans le fichier sudoers. Cet incident sera signalé.`, cls: 'text-term-dim' }])
      break
    case 'ls':
      push([{ text: 'about/  projects/  skills/  experience/  education/  contact/' }])
      break
    default:
      sound.err()
      push([{ text: `command not found: ${name} — tape 'help'`, cls: 'text-red-400/80' }])
      return
  }
  sound.ok()
}

function submit() {
  const value = input.value
  if (value.trim()) {
    history.value.push(value)
    histIndex.value = history.value.length
  }
  run(value)
  input.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!history.value.length) return
    histIndex.value = Math.max(0, histIndex.value - 1)
    input.value = history.value[histIndex.value] ?? ''
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!history.value.length) return
    histIndex.value = Math.min(history.value.length, histIndex.value + 1)
    input.value = history.value[histIndex.value] ?? ''
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const match = COMMANDS.find((c) => c.startsWith(input.value.trim().toLowerCase()))
    if (match) input.value = match
  } else if (e.key.length === 1) {
    sound.key()
  }
}

function focusField() {
  field.value?.focus()
}
</script>

<template>
  <div
    class="mt-8 overflow-hidden rounded-lg border border-term-border bg-term-bg/60"
    @click="focusField"
  >
    <div class="flex items-center gap-2 border-b border-term-border px-3 py-1.5 text-xs text-term-dim">
      <span class="text-term-green">&gt;_</span> console interactive
      <span class="ml-auto hidden sm:inline">↑↓ historique · Tab complétion</span>
    </div>
    <div ref="scroller" class="max-h-56 overflow-y-auto px-3 py-2 text-sm leading-relaxed">
      <p
        v-for="(line, i) in output"
        :key="i"
        class="whitespace-pre-wrap break-words"
        :class="line.cls || 'text-term-muted'"
      >
        {{ line.text }}
      </p>
      <div class="flex items-center gap-2">
        <span class="shrink-0 text-term-green">{{ prompt }}</span>
        <input
          ref="field"
          v-model="input"
          type="text"
          class="term-input w-full flex-1 border-0 bg-transparent p-0 text-term-bright placeholder:text-term-dim focus:outline-none focus:ring-0"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          aria-label="Entrée de commande du terminal"
          @keydown="onKeydown"
          @keyup.enter="submit"
        />
      </div>
    </div>
  </div>
</template>
