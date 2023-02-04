const fs = require('fs')
const fg = require('fast-glob')
const { patterns, getRoutes } = require('./src/getRoutes.js')
const { defaultOptions, format, template, optionsSchema, capitalize } = require('./src/utils.js')

class GeneroutedNextJsPlugin {
  #latestContent = ''
  #options

  constructor(options = {}) {
    options = { ...options, ...defaultOptions }
    this.#options = optionsSchema.parse(options)
  }
  apply(compiler) {
    compiler.hooks.afterPlugins.tap('MyPlugin', async (context, entry) => {
      this.#generate()
      return entry
    })
  }

  #generate() {
    try {
      const start = Date.now()
      const filePattern = '**/[\\w[-]*.{jsx,tsx}'
      const dirs = ['./src/pages/', './pages/'].map((x) => x + filePattern)
      const files = fg.sync(dirs, { onlyFiles: true })

      const imports = []
      const modules = []
      const paths = []
      const params = []
      const { routes, preserved, exports, count } = getRoutes(
        files,
        (key, exports, _id = '') => {
          const { loader, action, catch_ } = exports
          const id = _id.replace('_layout', '')
          const index = /(?<!pages\/)index\.(jsx|tsx)$/.test(key)
          const module = `import('./pages/${key.replace(...patterns.route)}')`
          const path = key
            .replace(...patterns.route)
            .replace(...patterns.splat)
            .replace(...patterns.param)
            .replace(...patterns.optional)
            .replace(/\(\w+\)\/|\/?_layout/g, '')
            .replace(/\/?index|\./g, '/')
            .replace(/(\w)\/$/g, '$1')

          const element = `lazy(() => ${module})`
          const errorElement = catch_ ? `lazy(() => ${module}.then((m) => ({ default: m.Catch })))` : ''

          modules.push(`const ${capitalize(id)} = ${element}`)
          if (errorElement) modules.push(`const ${capitalize(id)}Error = ${errorElement}`)
          if (path) paths.push(path.length > 1 ? `/${path}` : path)

          const param = path.split('/').filter((segment) => segment.startsWith(':'))
          if (param.length) {
            params.push(`'/${path}': { ${param.map((p) => p.replace(/:(.+)(\?)?/, '$1$2:') + 'string').join(';')} }`)
          }

          return {
            index,
            element: `#_<Suspense fallback={null} children={<${capitalize(id)} />} />_#`,
            loader: loader ? `#_(args: any) => ${module}.then((m) => m.Loader.apply(m.Loader, args as any))_#` : '',
            action: action ? `#_(args: any) => ${module}.then((m) => m.Action.apply(m.Action, args as any))_#` : '',
            errorElement: errorElement ? `#_<Suspense fallback={null} children={<${capitalize(id)}Error />} />_#` : '',
          }
        },
        patterns
      )

      if (preserved._app && exports['_app'].default) {
        imports.push(`import app from './pages/_app'`)
        modules.push(`const App = app || Fragment`)
      } else {
        modules.push(`const App = Fragment`)
      }

      if (preserved._404 && exports['404'].default) {
        imports.push(`import noMatch from './pages/404'`)
        modules.push(`const NoMatch = noMatch || Fragment`)
      } else {
        modules.push(`const NoMatch = Fragment`)
      }

      const config = JSON.stringify(routes, function (key, value) {
        const { id, pid, path, ...props } = this

        if (key === 'path' && props.index) return undefined
        if (['pid'].includes(key) || key.startsWith('_') || !value) return undefined

        return value
      }).replace(/"#_|_#"/g, '')

      const types =
        `type Path = "${[...new Set(paths)].sort().join('" | "')}"`.replace(/"/g, "'") +
        '\n\n' +
        `type Params = { ${params.join('; ')} }`

      const content = template
        .replace('// imports', imports.join('\n'))
        .replace('// modules', modules.join('\n'))
        .replace('// config', config)
        .replace('// types', types)

      if (this.#latestContent === content) return
      this.#latestContent = content

      fs.writeFileSync(this.#options.output, content)
      format(this.#options.output)
      console.log(`${new Date().toLocaleTimeString()} [generouted] ${count} routes in ${Date.now() - start} ms`)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = GeneroutedNextJsPlugin
