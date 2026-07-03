import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

const PUBLIC_ENV_DEFAULTS = {
  production: {
    VITE_PUBLIC_BACKEND_URL: 'https://api.irere.dev',
    VITE_PUBLIC_APP_URL: 'https://lemma.irere.dev',
  },
  development: {
    VITE_PUBLIC_BACKEND_URL: 'http://localhost:4000',
    VITE_PUBLIC_APP_URL: 'http://localhost:3000',
  },
} as const

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_PUBLIC_')
  const defaults =
    mode === 'production'
      ? PUBLIC_ENV_DEFAULTS.production
      : PUBLIC_ENV_DEFAULTS.development

  const define = Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      `import.meta.env.${key}`,
      JSON.stringify(env[key] ?? fallback),
    ]),
  )

  return {
    define,
    server: {
      port: 3000,
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths(),
      tanstackStart({
        srcDirectory: 'src',
        start: { entry: './start.tsx' },
        server: { entry: './server.ts' },
      }),
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      viteReact(),
    ],
  }
})
