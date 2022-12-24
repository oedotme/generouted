import { writeFileSync, readFileSync } from 'fs'
import fg from 'fast-glob'

import { format } from './format'
import { Options } from './options'

const template = `import { Fragment } from 'react'
import { createReactRouter, createRouteConfig, lazy, RouterProvider } from '@tanstack/react-router'

// __imports__

// __modules__

const config = root.addChildren([
  // __routes__,
  _404,
])

const router = createReactRouter({ routeConfig: config, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

export const Routes = () => <RouterProvider router={router} />
`
const patterns = {
  route: [/^.?\/src\/pages\/|^\/pages\/|\.(jsx|tsx)$/g, ''],
  splat: [/\[\.{3}.+\]/, '*'],
  param: [/\[([^\]]+)\]/g, '$$$1'],
  slash: [/index|\./g, '/'],
} as const

type BaseRoute = { path?: string; children?: BaseRoute[] } & Record<string, any>

const getRouteId = (path: string) => path.replace(...patterns.route).replace(/\W/g, '')
const getRouteExports = (content: string) => ({
  default: /^export\s+default\s/gm.test(content),
  loader: /^export\s+(const|function)\s+Loader(\s|\()/gm.test(content),
  action: /^export\s+(const|function)\s+Action(\s|\()/gm.test(content),
  errorElement: /^export\s+(const|function)\s+ErrorElement(\s|\()/gm.test(content),
})

const generateRoutes = async () => {
  const source = ['./src/pages/**/[\\w[]*.{jsx,tsx}']
  const files = await fg(source, { onlyFiles: true })

  const imports: string[] = []
  const modules: string[] = []

  const filteredRoutes = files
    .filter((key) => !key.includes('/_') || /(_app|_layout)\.(jsx|tsx)$/.test(key))
    .sort((a, z) => +z.includes('_layout') - +a.includes('_layout'))
    .sort((a, z) => +z.includes('pages/_app') - +a.includes('pages/_app'))

  const ids = filteredRoutes.map((route) => getRouteId(route))

  if (ids.includes('_app')) {
    imports.push(`import App from './pages/_app'`)
    modules.push(`const root = createRouteConfig({ component: App || Fragment })`)
  } else {
    modules.push(`const root = createRouteConfig({ component: Fragment })`)
  }

  if (ids.includes('404')) {
    imports.push(`import NoMatch from './pages/404'`)
    const props = [`path: '*'`, 'component: NoMatch || Fragment']
    modules.push(`const _404 = root.createRoute({ ${props.join(', ')} })`)
  } else {
    const props = [`path: '*'`, 'component: Fragment']
    modules.push(`const _404 = root.createRoute({ ${props.join(', ')} })`)
  }

  const routes = filteredRoutes.reduce((routes, key) => {
    const id = getRouteId(key)

    const content = readFileSync(key, { encoding: 'utf-8' })
    const exports = getRouteExports(content)

    if (!exports.default) return routes
    if (['_app', '404'].includes(id) || ids.includes(id + '_layout')) return routes

    const route = {
      component: `lazy(() => import('./pages/${key.replace(...patterns.route)}'))`,
    }

    const segments = key
      .replace(...patterns.route)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .split('/')
      .filter(Boolean)

    segments.reduce((parent, segment, index) => {
      const path = segment.replace(...patterns.slash)
      const root = index === 0
      const leaf = index === segments.length - 1 && segments.length > 1
      const node = !root && !leaf
      const layout = segment === '_layout'
      const insert = /^\w|\//.test(path) ? 'unshift' : 'push'

      if (root) {
        const dynamic = path.startsWith(':') || path === '*'
        if (dynamic) return parent

        const last = segments.length === 1
        if (last) {
          routes.push({ id, path })
          const props = [`path: '${path}'`, `component: ${route.component}`]
          modules.push(`const ${id} = root.createRoute({ ${props.join(', ')} })`)
          return parent
        }
      }

      if (root || node) {
        const current = root ? routes : parent.children
        const found = current?.find((route) => route.path === path)
        if (found) found.children ??= []
        else {
          const _id = segments.slice(0, index + 1).join('')
          const pid = parent?.id || 'root'
          const props = [`path: '${path}'`]
          const route = `const ${_id} = ${pid}.createRoute({ ${props.join(', ')} })`
          if (!(_id + '_layout' === id) && !modules.includes(route)) modules.push(route)
          current?.[insert]({ id: _id, path, children: [] })
        }
        return found || (current?.[insert === 'unshift' ? 0 : current.length - 1] as BaseRoute)
      }

      if (layout) {
        const _id = segments.slice(0, index - 1).join('')
        const pid = _id || 'root'
        const props = [`path: '${parent?.path}'`, `component: ${route.component}`]
        modules.push(`const ${id} = ${pid}.createRoute({ ${props.join(', ')} })`)
        return Object.assign(parent, { id })
      }

      if (leaf) {
        const pid = parent?.id || 'root'
        const props = [`path: '${path}'`, `component: ${route.component}`]
        modules.push(`const ${id} = ${pid}.createRoute({ ${props.join(', ')} })`)
        parent?.children?.[insert]({ id, path })
      }

      return parent
    }, {} as BaseRoute)

    return routes
  }, [] as BaseRoute[])

  const __imports__ = imports.join('\n')
  const __modules__ = modules.join('\n')
  const __routes__ = JSON.stringify(routes, (key, value) => (key !== 'path' ? value : undefined))
    .replace(/"id":"(\w+)"/g, '$1')
    .replace(/^\[|\]$|{|}/g, '')
    .replace(/\[/g, '([')
    .replace(/\]/g, '])')
    .replace(/,"children":/g, '.addChildren')
    .replace(/\),/g, '),\n  ')

  const file = template
    .replace('// __imports__', __imports__)
    .replace('// __modules__', __modules__)
    .replace('// __routes__', __routes__)

  return { content: file, count: ids.length - 1 }
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
