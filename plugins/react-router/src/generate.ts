import { writeFileSync } from 'fs'
import fg from 'fast-glob'

import { patterns, getRoutes } from '@generouted/core'

import { format } from './format'
import { Options } from './options'
import { template } from './template'

const capitalize = (id: string) => id.replace(/\b[\w]/, (character) => character.toUpperCase())

const generateRoutes = async () => {
  const source = ['./src/pages/**/[\\w[-]*.{jsx,tsx}']
  const files = await fg(source, { onlyFiles: true })

  const imports: string[] = []
  const modules: string[] = []
  const paths: string[] = []
  const params: string[] = []

  const { routes, preserved, exports, count } = getRoutes(
    files,
    (key, exports, _id = '') => {
      const { loader, action, catch_ } = exports
      const id = _id.replace('_layout', '')
      const index = /index\.(jsx|tsx)$/.test(key) && !key.includes('pages/index')
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
      if (path) {
        if (path.includes('*')) paths.push('/' + path.replace(/\*/g, '${string}'))
        else paths.push(path.length > 1 ? `/${path}` : path)
      }

      const param = path.split('/').filter((segment) => segment.startsWith(':'))
      if (param.length) {
        params.push(`'/${path}': { ${param.map((p) => p.replace(/:(.+)(\?)?/, '$1$2:') + 'string').join(';')} }`)
      }

      return {
        index,
        element: `#_<Suspense fallback={null} children={<${capitalize(id)} />} />_#`,
        loader: loader ? `#_(args: any) => ${module}.then((m) => m.Loader.apply(m.Loader, [args] as any))_#` : '',
        action: action ? `#_(args: any) => ${module}.then((m) => m.Action.apply(m.Action, [args] as any))_#` : '',
        errorElement: errorElement ? `#_<Suspense fallback={null} children={<${capitalize(id)}Error />} />_#` : '',
      }
    },
    patterns
  )

  if (preserved._app && exports['_app'].default) {
    imports.push(`import app from './pages/_app'`)
    modules.push(`const App = app || Outlet`)
  } else {
    modules.push(`const App = Outlet`)
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
    `type Path = "${[...new Set(paths)].sort().join('" | "')}"`.replace(/"/g, '`') +
    '\n\n' +
    `type Params = { ${params.join('; ')} }`

  const content = template
    .replace('// imports', imports.join('\n'))
    .replace('// modules', modules.join('\n'))
    .replace('// config', config)
    .replace('// types', types)

  return { content, count }
}

let latestContent = ''

export const generate = async (options: Options) => {
  const start = Date.now()
  const { content, count } = await generateRoutes()
  console.log(`${new Date().toLocaleTimeString()} [generouted] ${count} routes in ${Date.now() - start} ms`)

  if (latestContent === content) return
  latestContent = content

  writeFileSync(`./src/${options.output}`, content)
  if (options.format) format(`./src/${options.output}`)
}
