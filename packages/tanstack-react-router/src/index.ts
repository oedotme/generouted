import path from 'path'
import { createUnplugin, UnpluginFactory } from 'unplugin'

import { generate } from './generate'
import { defaultOptions, Options } from './options'

const pluginName = 'generouted/tanstack-react-router'

export const unpluginFactory: UnpluginFactory<Partial<Options> | undefined> = (options) => {
  const resolvedOptions = { ...defaultOptions, ...options }

  return {
    name: pluginName,
    enforce: 'pre',
    transformInclude(id) {
      return id.endsWith('main.ts')
    },
    // Common hooks for all bundlers
    buildStart() {
      return generate(resolvedOptions, {info: (msg: string) => console.log(`[${pluginName}]`, msg)})
    },

    // Vite specific hooks
    vite: {
      configureServer(server) {        
        const logger = server.config.logger
        const listener = (file = '') =>
          file.includes(path.normalize('/src/pages/')) ? generate(resolvedOptions, logger) : null
        server.watcher.on('add', listener)
        server.watcher.on('change', listener)
        server.watcher.on('unlink', listener)
      },
    },
    webpack(compiler) {
      const logger = compiler.getInfrastructureLogger(pluginName) 

      if (compiler.options.mode === 'development') {
        compiler.hooks.watchRun.tapPromise(pluginName, async () => {
          await generate(resolvedOptions, logger)
          return Promise.resolve()
        })
      }
    },
    rspack(compiler) {
      const logger = compiler.getInfrastructureLogger(pluginName) 

      if (compiler.options.mode === 'development') {
        compiler.hooks.watchRun.tapPromise(pluginName, async () => {
          await generate(resolvedOptions, logger)
          return Promise.resolve()
        })
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

export const vitePlugin = unplugin.vite
export const webpackPlugin = unplugin.webpack
export const rspackPlugin = unplugin.rspack