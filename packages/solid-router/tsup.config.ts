import { defineConfig } from 'tsup'
import { solidPlugin as solid } from 'esbuild-plugin-solid'

export default defineConfig([
  {
    entry: ['src/core.ts', 'src/index*', 'src/client'],
    format: ['cjs','esm'],
    dts: {
      entry: {
        core: './node_modules/generouted/dist/core.d.ts',
        index: './node_modules/generouted/dist/solid-router.d.ts',
        'index-lazy': './node_modules/generouted/dist/solid-router-lazy.d.ts',
        'client/index': 'src/client/index.ts',
      },
    },
    external: ['solid-js', 'solid-js/web', '@solidjs/router'],
    noExternal: ['generouted'],
    esbuildPlugins: [solid()],
  },
  {
    entry: ['src/plugin'],
    outDir: 'dist/plugin',
    format: ['cjs', 'esm'],
    dts: { entry: 'src/plugin/index.ts' },
  },
])
