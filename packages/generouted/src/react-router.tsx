import { Fragment } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation, useRouteError } from 'react-router-dom'
import type { ActionFunction, RouteObject, LoaderFunction } from 'react-router-dom'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader: LoaderFunction; Action: ActionFunction; Catch: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Element>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const DefaultCatch = () => {
  throw useRouteError()
}

const regularRoutes = generateRegularRoutes<RouteObject, Module>(ROUTES, (module, key) => {
  const Element = module?.default || Fragment
  const Catch = module?.Catch || DefaultCatch
  const index = /index\.(jsx|tsx)$/.test(key) && !key.includes('pages/index') ? { index: true } : {}

  return {
    ...index,
    element: <Element />,
    loader: (...args) => module?.Loader?.(...args) || null,
    action: (...args) => module?.Action?.(...args) || null,
    errorElement: <Catch />,
  }
})

const App = preservedRoutes?.['_app'] || Outlet
const NotFound = preservedRoutes?.['404'] || Fragment

export const routes = [{ element: <App />, children: [...regularRoutes, { path: '*', element: <NotFound /> }] }]
export const Routes = () => <RouterProvider router={createBrowserRouter(routes)} />

export const Modals = () => {
  const current = useLocation().state?.modal
  const Modal = modalRoutes[current] || Fragment
  return <Modal />
}
