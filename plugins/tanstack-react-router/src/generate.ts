import { writeFileSync } from 'fs'
import fg from 'fast-glob'

import { patterns as corePatterns, getRoutes } from '@generouted/core'

import { format } from './format'
import { Options } from './options'
import { template } from './template'

const patterns = Object.assign(corePatterns, { param: [/\[([^\]]+)\]/g, '$$$1'] })

const generateRoutes = async () => {
  const source = ['./src/pages/**/[\\w[]*.{jsx,tsx}']
  const files = await fg(source, { onlyFiles: true })

  const imports: string[] = []
  const modules: string[] = []

  const { routes, preserved, exports, count } = getRoutes(
    files,
    (key, exports) => {
      const { loader, action, pending, catch_ } = exports
      const module = `import('./pages/${key.replace(...patterns.route)}')`

      return {
        _component: `lazy(() => ${module})`,
        _loader: loader ? `(...args) => ${module}.then((m) => m.Loader.apply(m.Loader, args as any))` : '',
        _action: action ? `(...args) => ${module}.then((m) => m.Action.apply(m.Action, args as any))` : '',
        _pendingComponent: pending ? `lazy(() => ${module}.then((m) => ({ default: m.Pending })))` : '',
        _errorComponent: catch_ ? `lazy(() => ${module}.then((m) => ({ default: m.Catch })))` : '',
      }
    },
    patterns
  )

  if (preserved._app && exports['_app'].default) {
    imports.push(`import App from './pages/_app'`)
    modules.push(`const root = createRouteConfig({ component: App || Fragment })`)
  } else {
    modules.push(`const root = createRouteConfig({ component: Fragment })`)
  }

  if (preserved._404 && exports['404'].default) {
    imports.push(`import NoMatch from './pages/404'`)
    modules.push(`const _404 = root.createRoute({ path: '*', component: NoMatch || Fragment })`)
  } else {
    modules.push(`const _404 = root.createRoute({ path: '*', component:  Fragment })`)
  }

  const config = JSON.stringify(routes, function (key, value) {
    if (key === 'id') {
      const { id, pid, path, ...properties } = this

      const options = Object.entries(properties)
        .filter(([key, value]) => key.startsWith('_') && Boolean(value))
        .map(([key, value]) => `${key.replace('_', '')}: ${value}`)

      const props = [path ? `path: '${path}'` : `id: '${id}'`, ...options].filter(Boolean)
      modules.push(`const ${id} = ${pid}.createRoute({ ${props.join(', ')} })`)
    }

    if (['pid', 'path'].includes(key) || key.startsWith('_')) return undefined
    return value
  })
    .replace(/"id":"(\w+)"/g, '$1')
    .replace(/^\[|\]$|{|}/g, '')
    .replace(/\[/g, '([')
    .replace(/\]/g, '])')
    .replace(/,"children":/g, '.addChildren')
    .replace(/\),/g, '),\n  ')

  const content = template
    .replace('// imports', imports.join('\n'))
    .replace('// modules', modules.join('\n'))
    .replace('// config', config)

  return { content, count }
}

let latestContent = ''

export const generate = async (options: Options) => {
  const start = Date.now()
  const { content, count } = await generateRoutes()
  console.log(`${new Date().toLocaleTimeString()} [generouted] ${count} routes in ${Date.now() - start} ms`)

  if (latestContent === content) return
  latestContent = content

  writeFileSync(options.output, content)
  format(options.output)
}
