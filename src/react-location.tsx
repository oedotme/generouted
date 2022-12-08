import { Fragment } from 'react'
import {
  LoaderFn,
  LoaderFnOptions,
  Outlet,
  ReactLocation,
  Route,
  RouteMatch,
  Router,
  RouterProps,
} from '@tanstack/react-location'

import { generatePreservedRoutes, generateRegularRoutes } from './core'

export type Element = () => JSX.Element
export type Module = { default: Element; Loader: LoaderFn; PendingElement: Element; ErrorElement: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Element>(PRESERVED)

export const buildRegularRoute = (module: () => Promise<Module>) => ({
  element: () => module().then((mod) => (mod?.default ? <mod.default /> : null)),
  loader: async (...args: [routeMatch: RouteMatch, opts: LoaderFnOptions]) =>
    module().then((mod) => mod?.Loader?.(...args) || null),
  pendingElement: async () => module().then((mod) => (mod?.PendingElement ? <mod.PendingElement /> : null)),
  errorElement: async () => module().then((mod) => (mod?.ErrorElement ? <mod.ErrorElement /> : null)),
})

const regularRoutes = generateRegularRoutes<Route, () => Promise<Module>>(ROUTES, buildRegularRoute)

const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment

const location = new ReactLocation()
export const routes = [...regularRoutes, { path: '*', element: <NotFound /> }]

export const Routes = (props: Omit<RouterProps, 'children' | 'location' | 'routes'> = {}) => {
  return (
    <Router {...props} location={location} routes={routes}>
      <App>
        <Outlet />
      </App>
    </Router>
  )
}
