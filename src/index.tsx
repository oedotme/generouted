import { Fragment } from 'react'
import { LoaderFn, Outlet, ReactLocation, Route, Router, RouterProps } from '@tanstack/react-location'

import { generatePreservedRoutes } from './utils'

type Element = () => JSX.Element
type Module = { default: Element; Loader: LoaderFn; Pending: Element; Failure: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Element>(PRESERVED)

const regularRoutes = Object.keys(ROUTES).reduce<Route[]>((routes, key) => {
  const module = ROUTES[key]
  const route: Route = {
    element: () => module().then((mod) => (mod?.default ? <mod.default /> : <></>)),
    loader: async (...args) => module().then((mod) => mod?.Loader?.(...args)),
    pendingElement: async () => module().then((mod) => (mod?.Pending ? <mod.Pending /> : null)),
    errorElement: async () => module().then((mod) => (mod?.Failure ? <mod.Failure /> : null)),
  }

  const segments = key
    .replace(...patterns.clean)
    .replace(...patterns.catch)
    .replace(...patterns.param)
    .split('/')
    .filter(Boolean)

  segments.reduce((parent, segment, index) => {
    const path = segment.replace(...patterns.index)
    const root = index === 0
    const leaf = index === segments.length - 1 && segments.length > 1
    const node = !root && !leaf
    const insert = /^\w|\//.test(path) ? 'unshift' : 'push'

    if (root) {
      const dynamic = path.startsWith(':') || path === '*'
      if (dynamic) return parent

      const last = segments.length === 1
      if (last) {
        routes.push({ path, ...route })
        return parent
      }
    }

    if (root || node) {
      const current = root ? routes : parent.children
      const found = current?.find((route) => route.path === path)
      if (found) found.children ??= []
      else current?.[insert]({ path, children: [] })
      return found || (current?.[insert === 'unshift' ? 0 : current.length - 1] as Route)
    }

    if (leaf) {
      parent?.children?.[insert]({ path, ...route })
    }

    return parent
  }, {} as Route)

  return routes
}, [])

const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment

const location = new ReactLocation()
const routes = [...regularRoutes, { path: '*', element: <NotFound /> }]

export const Routes = (props: Omit<RouterProps, 'children' | 'location' | 'routes'> = {}) => {
  return (
    <Router {...props} location={location} routes={routes}>
      <App>
        <Outlet />
      </App>
    </Router>
  )
}
