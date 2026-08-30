import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vault: '#0F1014',
        panel: '#16181D',
        line: '#2A2E38',
        card: '#F7F4EC',
        cardWindow: '#E8E3D6',
        ink: '#1B1D22',
        muted: '#6B7080',
        accent: '#EE3831',
      },
      fontFamily: {
        display: ['Bungee', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
