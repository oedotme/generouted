import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router/plugin'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [{ enforce: 'pre', ...mdx() }, react(), generouted.vite()],
  resolve: { alias: { '@': '/src' } },
})
