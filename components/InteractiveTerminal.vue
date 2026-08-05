<script setup lang="ts">
const { profile, projects, skills, experiences, education } = usePortfolio()
const { theme } = useSettings()
const matrix = useMatrix()
const arcade = useArcade()
const sound = useSound()
const { t, te, tm, rt } = useI18n()

interface Line {
  text: string
  cls?: string
  anecdote?: string
  revealed?: boolean
}

const prompt = `${profile.handle}@${profile.host}:~$`
const input = ref('')
const history = ref<string[]>([])
const histIndex = ref(-1)
const output = ref<Line[]>([{ text: t('terminal.hint'), cls: 'text-term-dim' }])
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
  'tetris',
  'breakout',
  'pong',
  'hack',
  'nmap',
  'fortune',
  'sl',
  'ping',
  'top',
  'coffee',
  'logs',
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
        { text: t('terminal.helpHeader'), cls: 'text-term-bright' },
        { text: `  help        ${t('terminal.help.help')}` },
        { text: `  about       ${t('terminal.help.about')}` },
        { text: `  whoami      ${t('terminal.help.whoami')}` },
        { text: `  projects    ${t('terminal.help.projects')}` },
        { text: `  skills      ${t('terminal.help.skills')}` },
        { text: `  experience  ${t('terminal.help.experience')}` },
        { text: `  education   ${t('terminal.help.education')}` },
        { text: `  contact     ${t('terminal.help.contact')}` },
        { text: `  social      ${t('terminal.help.social')}` },
        { text: `  resume      ${t('terminal.help.resume')}` },
        { text: `  theme <x>   ${t('terminal.help.theme')}` },
        { text: `  matrix      ${t('terminal.help.matrix')}` },
        { text: `  snake       ${t('terminal.help.snake')}` },
        { text: `  tetris      ${t('terminal.help.tetris')}` },
        { text: `  breakout    ${t('terminal.help.breakout')}` },
        { text: `  pong        ${t('terminal.help.pong')}` },
        { text: `  hack <host> ${t('terminal.help.hack')}` },
        { text: `  fortune     ${t('terminal.help.fortune')}` },
        { text: `  sl          ${t('terminal.help.sl')}` },
        { text: `  ping <host> ${t('terminal.help.ping')}` },
        { text: `  top         ${t('terminal.help.top')}` },
        { text: `  coffee      ${t('terminal.help.coffee')}` },
        { text: `  logs        ${t('terminal.help.logs')}` },
        { text: `  neofetch    ${t('terminal.help.neofetch')}` },
        { text: `  cowsay <m>  ${t('terminal.help.cowsay')}` },
        { text: `  curl <proj> ${t('terminal.help.curl')}` },
        { text: `  weather     ${t('terminal.help.weather')}` },
        { text: `  open <proj> ${t('terminal.help.open')}` },
        { text: `  man <cmd>   ${t('terminal.help.man')}` },
        { text: `  history     ${t('terminal.help.history')}` },
        { text: `  print       ${t('terminal.help.print')}` },
        { text: `  date        ${t('terminal.help.date')}` },
        { text: `  clear       ${t('terminal.help.clear')}` },
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
        { text: t('terminal.projectsHeader', { count: projects.length }), cls: 'text-term-bright' },
        ...projects.map((p) => ({
          text: `  ${p.name} — ${p.tags.slice(0, 3).join(', ')} (${p.year})`,
        })),
        { text: t('terminal.projectsSee'), cls: 'text-term-dim' },
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
        push([{ text: t('terminal.resumeOpening', { url: profile.resume }), cls: 'text-term-green' }])
        window.open(profile.resume, '_blank', 'noopener')
      } else {
        push([{ text: t('terminal.resumeUnavailable'), cls: 'text-term-dim' }])
      }
      break
    case 'theme':
      if (arg === 'green' || arg === 'amber' || arg === 'blue') {
        theme.value = arg
        push([{ text: t('terminal.themeSet', { theme: arg }), cls: 'text-term-green' }])
      } else if (arg === 'random') {
        const others = (['green', 'amber', 'blue'] as const).filter((t) => t !== theme.value)
        const pick = others[Math.floor(Math.random() * others.length)]
        theme.value = pick
        push([{ text: t('terminal.themeRandom', { theme: pick }), cls: 'text-term-green' }])
      } else {
        push([{ text: t('terminal.themeUsage'), cls: 'text-term-dim' }])
      }
      break
    case 'matrix': {
      const started = matrix.start(7000)
      push([
        started
          ? { text: t('terminal.matrixStart'), cls: 'text-term-green' }
          : { text: t('terminal.matrixReduced'), cls: 'text-term-dim' },
      ])
      break
    }
    case 'date':
      push([{ text: new Date().toLocaleString(t('terminal.dateLocale')) }])
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
      const msg = arg || t('terminal.cowDefault')
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
        push([{ text: t('terminal.historyEmpty'), cls: 'text-term-dim' }])
      } else {
        push(history.value.map((h, i) => ({ text: `  ${String(i + 1).padStart(3, ' ')}  ${h}` })))
      }
      break
    case 'man': {
      const target = (args[0] || '').toLowerCase()
      const manual: Record<string, string> = {
        about: t('terminal.man.about'),
        projects: t('terminal.man.projects'),
        skills: t('terminal.man.skills'),
        theme: t('terminal.man.theme'),
        matrix: t('terminal.man.matrix'),
        neofetch: t('terminal.man.neofetch'),
        open: t('terminal.man.open'),
        resume: t('terminal.man.resume'),
        print: t('terminal.man.print'),
      }
      if (!target) {
        push([{ text: t('terminal.manUsage'), cls: 'text-term-dim' }])
      } else if (manual[target]) {
        push([{ text: `${target} — ${manual[target]}` }])
      } else {
        push([{ text: t('terminal.manNone', { name: target }), cls: 'text-term-dim' }])
      }
      break
    }
    case 'open': {
      const q = (args[0] || '').toLowerCase()
      if (!q) {
        push([{ text: t('terminal.openUsage'), cls: 'text-term-dim' }])
        break
      }
      const proj = projects.find((p) => p.name.toLowerCase().includes(q))
      if (!proj) {
        push([{ text: t('terminal.projNotFound', { query: q }), cls: 'text-term-dim' }])
        break
      }
      const url = proj.links.demo && proj.links.demo !== '#' ? proj.links.demo : proj.links.source
      if (url && url !== '#') {
        push([{ text: t('terminal.opening', { name: proj.name, url }), cls: 'text-term-green' }])
        window.open(url, '_blank', 'noopener')
      } else {
        push([{ text: t('terminal.noPublicLink', { name: proj.name }), cls: 'text-term-dim' }])
      }
      break
    }
    case 'print':
      push([{ text: t('terminal.printOpening'), cls: 'text-term-green' }])
      setTimeout(() => window.print(), 150)
      break
    case 'snake': {
      arcade.start('snake')
      push([{ text: t('terminal.snakeStart'), cls: 'text-term-green' }])
      break
    }
    case 'tetris': {
      arcade.start('tetris')
      push([{ text: t('terminal.gameStart', { game: 'tetris' }), cls: 'text-term-green' }])
      break
    }
    case 'breakout': {
      arcade.start('breakout')
      push([{ text: t('terminal.gameStart', { game: 'breakout' }), cls: 'text-term-green' }])
      break
    }
    case 'pong': {
      arcade.start('pong')
      push([{ text: t('terminal.gameStart', { game: 'pong' }), cls: 'text-term-green' }])
      break
    }
    case 'hack':
    case 'nmap': {
      hack(args[0] || profile.host)
      break
    }
    case 'fortune': {
      const list = tm('terminal.fortunes') as unknown[]
      const pick = list.length ? rt(list[Math.floor(Math.random() * list.length)] as string) : ''
      push([{ text: `“ ${pick} ”`, cls: 'text-term-bright' }])
      break
    }
    case 'sl': {
      steamTrain()
      break
    }
    case 'ping': {
      pingHost(args[0] || profile.website.replace(/^https?:\/\//, '') || profile.host)
      break
    }
    case 'top': {
      const procs = [
        ['1337', 'nuxt', '12.4', '148M'],
        ['2048', 'vue-devtools', '6.1', '92M'],
        ['0042', 'coffee-daemon', '99.9', '512M'],
        ['0007', 'three.js', '8.7', '210M'],
        ['4711', 'tailwind-jit', '2.3', '64M'],
        ['3141', 'lofi-beats', '1.1', '31M'],
      ]
      push([
        { text: t('terminal.topHeader'), cls: 'text-term-dim' },
        { text: '  PID   COMMAND         %CPU    MEM', cls: 'text-term-bright' },
        ...procs.map((p) => ({
          text: `  ${p[0].padEnd(5)} ${p[1].padEnd(15)} ${p[2].padStart(4)}   ${p[3].padStart(5)}`,
        })),
        { text: t('terminal.topFooter'), cls: 'text-term-dim' },
      ])
      break
    }
    case 'coffee': {
      push([
        { text: '      ( (', cls: 'text-term-bright' },
        { text: '       ) )', cls: 'text-term-bright' },
        { text: '    ........', cls: 'text-term-green' },
        { text: '    |      |]', cls: 'text-term-green' },
        { text: '    \\      /', cls: 'text-term-green' },
        { text: "     `----'", cls: 'text-term-green' },
        { text: t('terminal.coffee'), cls: 'text-term-dim' },
      ])
      break
    }
    case 'logs': {
      showLogs()
      break
    }
    case 'curl': {
      const q = (args[0] || '').toLowerCase()
      if (!q) {
        push([{ text: t('terminal.curlUsage'), cls: 'text-term-dim' }])
        break
      }
      const proj = projects.find((p) => p.name.toLowerCase().includes(q))
      if (!proj) {
        push([{ text: t('terminal.projNotFound', { query: q }), cls: 'text-term-dim' }])
        break
      }
      push([
        { text: proj.name, cls: 'text-term-bright' },
        { text: proj.description },
        { text: `${t('terminal.curlYear')}   : ${proj.year} · ${t('terminal.curlStatus')} : ${t(`status.${proj.status}`)}` },
        { text: `${t('terminal.curlStack')}   : ${proj.tags.join(', ')}` },
        { text: `${t('terminal.curlDemo')}    : ${proj.links.demo && proj.links.demo !== '#' ? proj.links.demo : '—'}`, cls: 'text-term-green' },
        { text: `${t('terminal.curlSource')}  : ${proj.links.source || '—'}`, cls: 'text-term-green' },
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
          { text: t('terminal.sudoPrompt'), cls: 'text-term-dim' },
          { text: t('terminal.sudoGranted'), cls: 'text-term-green' },
          { text: t('terminal.sudoWrite', { email: profile.email }), cls: 'text-term-bright' },
        ])
      } else {
        push([{ text: t('terminal.sudoNotSudoers', { handle: profile.handle }), cls: 'text-term-dim' }])
      }
      break
    case 'ls':
      push([{ text: 'about/  projects/  skills/  experience/  education/  contact/' }])
      break
    default:
      sound.err()
      push([{ text: t('terminal.notFound', { name }), cls: 'text-red-400/80' }])
      return
  }
  sound.ok()
}

async function weather() {
  push([{ text: t('terminal.weatherFetch'), cls: 'text-term-dim' }])
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
    const c = r.current
    const code = String(c.weather_code)
    const desc = te(`terminal.weatherCodes.${code}`)
      ? t(`terminal.weatherCodes.${code}`)
      : t('terminal.weatherVaries')
    push([
      { text: `Bourges, France`, cls: 'text-term-bright' },
      { text: desc },
      {
        text: t('terminal.weatherTemp', {
          temp: Math.round(c.temperature_2m),
          wind: Math.round(c.wind_speed_10m),
        }),
      },
    ])
  } catch {
    push([{ text: t('terminal.weatherUnavailable'), cls: 'text-term-dim' }])
  }
}

// Anime l'affichage ligne par ligne (instantané si animations réduites).
function animate(lines: Line[], step = 240) {
  if (isReducedMotion()) {
    push(lines)
    return
  }
  let d = 0
  for (const l of lines) {
    d += step
    setTimeout(() => push([l]), d)
  }
}

function hack(host: string) {
  animate([
    { text: `$ nmap -sS -T4 ${host}`, cls: 'text-term-dim' },
    { text: 'Starting Nmap 7.94 ( https://nmap.org )' },
    { text: `Scanning ${host} …` },
    { text: 'Discovered open port 22/tcp   (ssh)', cls: 'text-term-green' },
    { text: 'Discovered open port 80/tcp   (http)', cls: 'text-term-green' },
    { text: 'Discovered open port 443/tcp  (https)', cls: 'text-term-green' },
    { text: 'bypassing firewall  [■■■■■□□□□□]  50%' },
    { text: 'bypassing firewall  [■■■■■■■■■■] 100%' },
    { text: 'ACCESS GRANTED ▓▓▓', cls: 'text-term-bright' },
    { text: t('terminal.hackJoke'), cls: 'text-term-dim' },
  ])
}

function pingHost(host: string) {
  const lines: Line[] = [{ text: `PING ${host}: 56 data bytes`, cls: 'text-term-dim' }]
  for (let i = 0; i < 4; i++) {
    const ms = (Math.random() * 30 + 5).toFixed(1)
    lines.push({ text: `64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${ms} ms` })
  }
  lines.push({ text: t('terminal.pingStats'), cls: 'text-term-green' })
  animate(lines, 200)
}

function steamTrain() {
  push([
    { text: '      ====        ________                ___________', cls: 'text-term-green' },
    { text: '  _D _|  |_______/        \\__I_I_____===__|_________|', cls: 'text-term-green' },
    { text: "   |(_)---  |   H\\________/ |   |        =|___ ___|", cls: 'text-term-green' },
    { text: '   /     |  |   H  |  |     |   |         ||_| |_||', cls: 'text-term-green' },
    { text: '  |      |  |   H  |__--------------------| [___] |', cls: 'text-term-green' },
    { text: '  | ________|___H__/__|_____/[][]~\\_______|       |', cls: 'text-term-green' },
    { text: '  |/ |   |-----------I_____I [][] []  D   |=======|__', cls: 'text-term-green' },
    { text: t('terminal.slJoke'), cls: 'text-term-dim' },
  ])
}

function showLogs() {
  push([
    { text: t('terminal.logsBoot'), cls: 'text-term-green' },
    { text: `[  OK  ] ${t('terminal.logs.l1')}`, anecdote: t('terminal.logs.a1') },
    { text: `[  OK  ] ${t('terminal.logs.l2')}`, anecdote: t('terminal.logs.a2') },
    { text: `[  OK  ] ${t('terminal.logs.l3')}`, anecdote: t('terminal.logs.a3') },
    { text: `[  OK  ] ${t('terminal.logs.l4')}`, anecdote: t('terminal.logs.a4') },
    { text: `[ WARN ] ${t('terminal.logs.l5')}`, anecdote: t('terminal.logs.a5') },
    { text: t('terminal.logsHint'), cls: 'text-term-dim' },
  ])
}

function toggleLine(line: Line) {
  if (!line.anecdote) return
  line.revealed = !line.revealed
  sound.click()
}


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
      <span class="text-term-green">&gt;_</span> {{ t('terminal.console') }}
      <span class="ml-auto hidden sm:inline">{{ t('terminal.hints') }}</span>
    </div>
    <div ref="scroller" class="max-h-56 overflow-y-auto px-3 py-2 text-sm leading-relaxed">
      <template v-for="(line, i) in output" :key="i">
        <button
          v-if="line.anecdote"
          type="button"
          class="block w-full text-left whitespace-pre-wrap break-words transition-colors hover:text-term-bright"
          :class="line.cls || 'text-term-muted'"
          @click.stop="toggleLine(line)"
        >
          {{ line.text }} <span class="text-term-green">{{ line.revealed ? '▾' : 'ⓘ' }}</span>
        </button>
        <p
          v-if="line.anecdote && line.revealed"
          class="whitespace-pre-wrap break-words pl-4 text-term-dim"
        >
          ↳ {{ line.anecdote }}
        </p>
        <p
          v-else-if="!line.anecdote"
          class="whitespace-pre-wrap break-words"
          :class="line.cls || 'text-term-muted'"
        >
          {{ line.text }}
        </p>
      </template>
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
            :aria-label="t('terminal.inputAria')"
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
