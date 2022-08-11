import { Fragment, useMemo } from 'react'
import { LoaderFn, Outlet, ReactLocation, Route, Router, RouterProps } from '@tanstack/react-location'

type Element = () => JSX.Element
type Module = { default: Element; Loader: LoaderFn; Pending: Element; Failure: Element }
type RouteAliases = { path: string; alias: string }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).tsx', { eager: true })
const ROUTES = import.meta.glob<Module>('/src/pages/**/[a-z[]*.tsx')

const preservedRoutes: Partial<Record<string, () => JSX.Element>> = Object.keys(PRESERVED).reduce((routes, key) => {
  const path = key.replace(/\/src\/pages\/|\.tsx$/g, '')
  return { ...routes, [path]: PRESERVED[key]?.default }
}, {})

const regularRoutes = Object.keys(ROUTES).reduce<Route[]>((routes, key) => {
  const module = ROUTES[key]
  const route: Route = {
    element: () => module().then((mod) => (mod?.default ? <mod.default /> : <></>)),
    loader: async (...args) => module().then((mod) => mod?.Loader?.(...args)),
    pendingElement: async () => module().then((mod) => (mod?.Pending ? <mod.Pending /> : null)),
    errorElement: async () => module().then((mod) => (mod?.Failure ? <mod.Failure /> : null)),
  }

  const segments = key
    .replace(/\/src\/pages|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[([^\]]+)\]/g, ':$1')
    .split('/')
    .filter(Boolean)

  segments.reduce((parent, segment, index) => {
    const path = segment.replace(/index|\./g, '/')
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
const catchAll = { path: '*', element: <NotFound /> }
const fileRoutes = [...regularRoutes]
type Props = Omit<RouterProps, 'children' | 'location' | 'routes'> &
  Partial<Pick<RouterProps, 'routes'>> & { aliases?: RouteAliases[] }
export const Routes = (props: Props = { routes: [] }) => {
  const routes = useMemo(() => {
    const knownRoutes = [...(props.routes || []), ...fileRoutes]
    // aliases should be used to alias one route to another
    // for instance, { alias: '/index.html', '/' }
    if (props.aliases?.length) {
      props.aliases.forEach((alias) => {
        const matchingRoute = knownRoutes.find((l) => l.path === alias.path)
        if (matchingRoute) {
          const newRoute = { ...matchingRoute }
          newRoute.path = alias.alias
          knownRoutes.push(newRoute)
        }
      })
    }
    knownRoutes.push(catchAll)
    return knownRoutes
  }, [props.routes, props.aliases])

  return (
    <Router {...props} location={location} routes={routes}>
      <App>
        <Outlet />
      </App>
    </Router>
  )
}
