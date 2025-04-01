import { Fragment, JSX } from 'react'
import { LoaderFn, Outlet, ReactLocation, Route, Router, RouterProps } from '@tanstack/react-location'

import { generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader: LoaderFn; Pending: Element; Catch: Element }

let PRESERVED: Record<string, Module>;
let ROUTES: Record<string, Module>;

if (typeof import.meta.env === 'object') {
  PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
  ROUTES = import.meta.glob<Module>(
    ['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!/src/pages/**/(_!(layout)*(/*)?|_app|404)*'],
    { eager: true },
  )
} else if (typeof __webpack_require__ === 'function') {
  const preservedContext = import.meta.webpackContext('/src/pages/', {
    regExp: /\/(_app|404)\.(jsx|tsx)$/i,
    mode: 'sync'
  })

  PRESERVED = preservedContext.keys().reduce<Record<string, Module>>((acc, key) => {
    acc[`/src/pages/${key.toString().replace('./', '')}`] = preservedContext(key) as Module;
    return acc;
  }, {})

  const routesContext = import.meta.webpackContext('/src/pages/', {
    recursive: true,
    regExp: /\/[\w[-][^/]*\.(jsx|tsx)$/i,
    mode: 'sync',
    exclude: /\/((_(?!layout)|_app|404).*)\.(jsx|tsx)$/i
  })

  ROUTES = routesContext.keys().reduce<Record<string, Module>>((acc, key) => {
    acc[`/src/pages/${key.toString().replace('./', '')}`] = routesContext(key) as Module;
    return acc;
  }, {})
} else {
  throw new Error('Current Bundler is not supported by Generouted. Please use Vite, Webpack or Rspack.')
}



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
