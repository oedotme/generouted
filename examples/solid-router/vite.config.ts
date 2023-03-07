import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import generouted from '@generouted/solid-router'

export default defineConfig({
  plugins: [solid(), generouted()],
  resolve: { alias: { '@': '/src' } },
})
