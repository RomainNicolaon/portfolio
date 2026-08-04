import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Les triplets RVB sont définis en CSS (assets/css/main.css) et changent
        // selon le thème (green / amber / blue) via [data-theme].
        term: {
          bg: 'rgb(var(--c-bg) / <alpha-value>)',
          panel: 'rgb(var(--c-panel) / <alpha-value>)',
          border: 'rgb(var(--c-border) / <alpha-value>)',
          dim: 'rgb(var(--c-dim) / <alpha-value>)',
          muted: 'rgb(var(--c-muted) / <alpha-value>)',
          green: 'rgb(var(--c-green) / <alpha-value>)',
          bright: 'rgb(var(--c-bright) / <alpha-value>)',
          neon: 'rgb(var(--c-neon) / <alpha-value>)',
        },
      },
      keyframes: {
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
    },
  },
}
