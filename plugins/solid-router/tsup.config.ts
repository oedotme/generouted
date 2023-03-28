import { defineConfig } from 'tsup'
import { solidPlugin as solid } from 'esbuild-plugin-solid'

export default defineConfig([
  {
    entry: ['src/index*', 'src/client'],
    format: ['esm'],
    dts: true,
    external: ['solid-js', 'solid-js/web', '@solidjs/router'],
    noExternal: ['generouted'],
    esbuildPlugins: [solid()],
  },
  {
    entry: ['src/plugin'],
    outDir: 'dist/plugin',
    format: ['cjs', 'esm'],
    dts: true,
  },
])
