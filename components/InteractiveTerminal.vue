<script setup lang="ts">
const { profile, projects, skills, experiences, education } = usePortfolio()
const { theme } = useSettings()
const matrix = useMatrix()
const arcade = useArcade()
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
  'neofetch',
  'cowsay',
  'curl',
  'weather',
  'snake',
  'history',
  'man',
  'open',
  'print',
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
        { text: '  snake       petit jeu ASCII' },
        { text: '  neofetch    infos système (facon Linux)' },
        { text: '  cowsay <m>  une vache le dit pour vous' },
        { text: '  curl <proj> détails d\'un projet' },
        { text: '  weather     météo à Bourges' },
        { text: '  open <proj> ouvrir un projet (source/demo)' },
        { text: '  man <cmd>   manuel d\'une commande' },
        { text: '  history     historique des commandes' },
        { text: '  print       imprimer / exporter en PDF' },
        { text: '  date        date et heure' },
        { text: '  clear       vider le terminal' },
      ])
      break
    case 'about':
      push(profile.about.map((t) => ({ text: t })))
      break
    case 'whoami':
      if (args.includes('--json')) {
        const data = {
          name: profile.name,
          handle: profile.handle,
          title: profile.title,
          location: profile.location,
          email: profile.email,
          website: profile.website,
        }
        push(
          JSON.stringify(data, null, 2)
            .split('\n')
            .map((t) => ({ text: t, cls: 'text-term-green' })),
        )
      } else {
        push([
          { text: profile.name, cls: 'text-term-bright' },
          { text: `${profile.title} · ${profile.location}` },
        ])
      }
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
      } else if (arg === 'random') {
        const others = (['green', 'amber', 'blue'] as const).filter((t) => t !== theme.value)
        const pick = others[Math.floor(Math.random() * others.length)]
        theme.value = pick
        push([{ text: `thème aléatoire → ${pick}`, cls: 'text-term-green' }])
      } else {
        push([{ text: 'usage: theme <green|amber|blue|random>', cls: 'text-term-dim' }])
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
    case 'neofetch': {
      const logo = [
        '       _.-""-._      ',
        '     .\'  ._.  \'.    ',
        '    /   (o o)   \\   ',
        '    |    \\_/    |   ',
        '    \\  \'---\'  /   ',
        '     \'._____.\'     ',
      ]
      const info = [
        `${profile.handle}@${profile.host}`,
        '-----------------',
        `OS       : Arch Linux (btw)`,
        `Shell    : zsh`,
        `Editor   : neovim`,
        `Theme    : ${theme.value}`,
        `Stack    : Nuxt · Vue · TypeScript`,
        `Location : ${profile.location}`,
        `Uptime   : ${Math.round(performance.now() / 1000)}s`,
      ]
      const rows = Math.max(logo.length, info.length)
      const lines: Line[] = []
      for (let i = 0; i < rows; i++) {
        const l = (logo[i] || '').padEnd(22, ' ')
        lines.push({ text: `${l}${info[i] || ''}`, cls: 'text-term-green' })
      }
      push(lines)
      break
    }
    case 'cowsay': {
      const msg = arg || 'meuh !'
      const top = ` ${'_'.repeat(msg.length + 2)}`
      const bottom = ` ${'-'.repeat(msg.length + 2)}`
      push([
        { text: top },
        { text: `< ${msg} >` },
        { text: bottom },
        { text: '        \\   ^__^' },
        { text: '         \\  (oo)\\_______' },
        { text: '            (__)\\       )\\/\\' },
        { text: '                ||----w |' },
        { text: '                ||     ||' },
      ])
      break
    }
    case 'history':
      if (!history.value.length) {
        push([{ text: 'aucune commande dans l\'historique', cls: 'text-term-dim' }])
      } else {
        push(history.value.map((h, i) => ({ text: `  ${String(i + 1).padStart(3, ' ')}  ${h}` })))
      }
      break
    case 'man': {
      const target = (args[0] || '').toLowerCase()
      const manual: Record<string, string> = {
        about: 'affiche une présentation détaillée.',
        projects: 'liste les projets ; voir aussi « open <projet> ».',
        skills: 'liste les compétences par catégorie.',
        theme: 'change le thème : theme <green|amber|blue>.',
        matrix: 'lance l\'effet Matrix (échap pour sortir).',
        neofetch: 'affiche des infos système facon Linux.',
        open: 'ouvre un projet : open <nom> (source ou démo).',
        resume: 'ouvre le CV au format PDF.',
        print: 'ouvre la boîte d\'impression (export PDF).',
      }
      if (!target) {
        push([{ text: 'usage: man <commande>', cls: 'text-term-dim' }])
      } else if (manual[target]) {
        push([{ text: `${target} — ${manual[target]}` }])
      } else {
        push([{ text: `pas de manuel pour « ${target} »`, cls: 'text-term-dim' }])
      }
      break
    }
    case 'open': {
      const q = (args[0] || '').toLowerCase()
      if (!q) {
        push([{ text: 'usage: open <projet>', cls: 'text-term-dim' }])
        break
      }
      const proj = projects.find((p) => p.name.toLowerCase().includes(q))
      if (!proj) {
        push([{ text: `projet introuvable : ${q}`, cls: 'text-term-dim' }])
        break
      }
      const url = proj.links.demo && proj.links.demo !== '#' ? proj.links.demo : proj.links.source
      if (url && url !== '#') {
        push([{ text: `ouverture de ${proj.name}… ${url}`, cls: 'text-term-green' }])
        window.open(url, '_blank', 'noopener')
      } else {
        push([{ text: `${proj.name} n'a pas de lien public.`, cls: 'text-term-dim' }])
      }
      break
    }
    case 'print':
      push([{ text: 'ouverture de la boîte d\'impression…', cls: 'text-term-green' }])
      setTimeout(() => window.print(), 150)
      break
    case 'snake': {
      arcade.start('snake')
      push([{ text: 'lancement de snake.exe… (échap pour quitter)', cls: 'text-term-green' }])
      break
    }
    case 'curl': {
      const q = (args[0] || '').toLowerCase()
      if (!q) {
        push([{ text: 'usage: curl <projet>', cls: 'text-term-dim' }])
        break
      }
      const proj = projects.find((p) => p.name.toLowerCase().includes(q))
      if (!proj) {
        push([{ text: `projet introuvable : ${q}`, cls: 'text-term-dim' }])
        break
      }
      push([
        { text: proj.name, cls: 'text-term-bright' },
        { text: proj.description },
        { text: `année   : ${proj.year} · statut : ${proj.status}` },
        { text: `stack   : ${proj.tags.join(', ')}` },
        { text: `demo    : ${proj.links.demo && proj.links.demo !== '#' ? proj.links.demo : '—'}`, cls: 'text-term-green' },
        { text: `source  : ${proj.links.source || '—'}`, cls: 'text-term-green' },
      ])
      break
    }
    case 'weather':
      void weather()
      break
    case 'clear':
      output.value = []
      return
    case 'sudo':
      if (arg === 'hire-me') {
        push([
          { text: '[sudo] mot de passe pour recruteur : ********', cls: 'text-term-dim' },
          { text: 'Accès autorisé ✅', cls: 'text-term-green' },
          { text: `Écrivez-moi : ${profile.email}`, cls: 'text-term-bright' },
        ])
      } else {
        push([{ text: `${profile.handle} n'est pas dans le fichier sudoers. Cet incident sera signalé.`, cls: 'text-term-dim' }])
      }
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

async function weather() {
  push([{ text: 'récupération de la météo à Bourges…', cls: 'text-term-dim' }])
  try {
    const r = await $fetch<{
      current: { temperature_2m: number; weather_code: number; wind_speed_10m: number }
    }>('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: 47.081,
        longitude: 2.398,
        current: 'temperature_2m,weather_code,wind_speed_10m',
      },
    })
    const codes: Record<number, string> = {
      0: 'ciel dégagé ☀️',
      1: 'plutôt dégagé 🌤️',
      2: 'partiellement nuageux ⛅',
      3: 'couvert ☁️',
      45: 'brouillard 🌫️',
      48: 'brouillard givrant 🌫️',
      51: 'bruine légère 🌧️',
      61: 'pluie faible 🌧️',
      63: 'pluie 🌧️',
      65: 'forte pluie 🌧️',
      71: 'neige ❄️',
      80: 'averses 🌦️',
      95: 'orage ⛈️',
    }
    const c = r.current
    push([
      { text: `Bourges, France`, cls: 'text-term-bright' },
      { text: `${codes[c.weather_code] || 'conditions variables'}` },
      { text: `température : ${Math.round(c.temperature_2m)}°C · vent : ${Math.round(c.wind_speed_10m)} km/h` },
    ])
  } catch {
    push([{ text: 'météo indisponible pour le moment.', cls: 'text-term-dim' }])
  }
}

// Suggestion « fantôme » (historique puis commandes), à la fish shell.
const ghost = computed(() => {
  const v = input.value
  if (!v) return ''
  for (let i = history.value.length - 1; i >= 0; i--) {
    const h = history.value[i]
    if (h.startsWith(v) && h !== v) return h.slice(v.length)
  }
  const lower = v.toLowerCase()
  const c = COMMANDS.find((cmd) => cmd.startsWith(lower) && cmd !== lower)
  return c ? c.slice(v.length) : ''
})

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
  } else if (e.key === 'ArrowRight') {
    const el = e.target as HTMLInputElement
    if (ghost.value && el.selectionStart === input.value.length) {
      e.preventDefault()
      input.value += ghost.value
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const parts = input.value.trimStart().split(/\s+/)
    if (parts.length <= 1) {
      const match = COMMANDS.find((c) => c.startsWith(parts[0].toLowerCase()))
      if (match) input.value = match
    } else if (parts[0].toLowerCase() === 'open') {
      const match = projects.find((p) => p.name.toLowerCase().startsWith(parts[1].toLowerCase()))
      if (match) input.value = `open ${match.name}`
    } else if (parts[0].toLowerCase() === 'theme') {
      const match = ['green', 'amber', 'blue'].find((t) => t.startsWith(parts[1].toLowerCase()))
      if (match) input.value = `theme ${match}`
    }
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
        <div class="relative w-full flex-1">
          <input
            ref="field"
            v-model="input"
            type="text"
            class="term-input relative z-10 w-full border-0 bg-transparent p-0 text-term-bright placeholder:text-term-dim focus:outline-none focus:ring-0"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            aria-label="Entrée de commande du terminal"
            @keydown="onKeydown"
            @keyup.enter="submit"
          />
          <span
            v-if="ghost"
            class="pointer-events-none absolute inset-0 z-0 select-none whitespace-pre text-sm text-term-dim"
            aria-hidden="true"
          ><span class="invisible">{{ input }}</span>{{ ghost }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
