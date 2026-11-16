import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/index-lazy.ts', 'src/core.ts'],
    format: ['esm'],
    dts: true,
    external: ['preact', 'preact-iso', 'vite', 'generouted', '@generouted/core'],
  },
  {
    entry: ['src/client/index.ts'],
    outDir: 'dist/client',
    format: ['esm'],
    dts: true,
    external: ['preact', 'preact-iso'],
  },
  {
    entry: ['src/plugin/index.ts'],
    outDir: 'dist/plugin',
    format: ['esm', 'cjs'],
    dts: true,
    external: ['vite', 'fast-glob'],
  },
]) 