import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        term: {
          bg: '#0a0e0a',
          panel: '#0f150f',
          border: '#1c2b1c',
          dim: '#3f6f3f',
          muted: '#7a9a7a',
          green: '#22c55e',
          bright: '#4ade80',
          neon: '#00ff41',
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
