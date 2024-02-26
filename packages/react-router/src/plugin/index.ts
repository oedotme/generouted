import path from 'path'
import { Plugin } from 'vite'

import { generate } from './generate'
import { defaultOptions, Options } from './options'

export default function Generouted(options?: Partial<Options>): Plugin {
  const resolvedOptions = { ...defaultOptions, ...options }

  return {
    name: 'generouted/react-router',
    enforce: 'pre',
    configureServer(server) {
      const listener = (file = '') => (file.includes(path.normalize('/src/pages/')) ? generate(resolvedOptions) : null)
      server.watcher.on('add', listener)
      server.watcher.on('change', listener)
      server.watcher.on('unlink', listener)
    },
    buildStart(): Promise<void> {
      return generate(resolvedOptions)
    },
  }
}
