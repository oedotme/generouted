import { Fragment } from 'react'
import { LoaderFn, Outlet, ReactLocation, Route, Router, RouterProps } from '@tanstack/react-location'

import { generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader: LoaderFn; Pending: Element; Catch: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Module>(PRESERVED)

const regularRoutes = generateRegularRoutes<Route, () => Promise<Module>>(ROUTES, (module) => ({
  element: () => module().then((mod) => (mod?.default ? <mod.default /> : null)),
  loader: (...args) => module().then((mod) => mod?.Loader?.(...args) || null),
  pendingElement: () => module().then((mod) => (mod?.Pending ? <mod.Pending /> : null)),
  errorElement: () => module().then((mod) => (mod?.Catch ? <mod.Catch /> : null)),
}))

const App = preservedRoutes?.['_app']?.default || Fragment
const NotFound = preservedRoutes?.['404']?.default || Fragment

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
