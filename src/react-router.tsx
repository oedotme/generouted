import { Fragment, lazy, Suspense } from 'react'
import { ActionFunctionArgs, createBrowserRouter, LoaderFunctionArgs, Outlet, RouterProvider } from 'react-router-dom'
import type { ActionFunction, RouteObject, LoaderFunction } from 'react-router-dom'

import { generatePreservedRoutes, generateRegularRoutes } from './core'

export type Element = () => JSX.Element
export type Module = { default: Element; Loader: LoaderFunction; Action: ActionFunction; ErrorElement: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Element>(PRESERVED)

export const buildRegularRoute = (module: () => Promise<Module>, key: string) => {
  const Element = lazy(module)
  const ErrorElement = lazy(() => module().then((module) => ({ default: module.ErrorElement || null })))
  const index = /(?<!pages\/)index\.(jsx|tsx)$/.test(key) ? { index: true } : {}

  return {
    ...index,
    element: <Suspense fallback={null} children={<Element />} />,
    loader: async (...args: [LoaderFunctionArgs]) => module().then((mod) => mod?.Loader?.(...args) || null),
    action: async (...args: [ActionFunctionArgs]) => module().then((mod) => mod?.Action?.(...args) || null),
    errorElement: <Suspense fallback={null} children={<ErrorElement />} />,
  }
}

const regularRoutes = generateRegularRoutes<RouteObject, () => Promise<Module>>(ROUTES, buildRegularRoute)

const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment

export const routes = [...regularRoutes, { path: '*', element: <NotFound /> }]
const router = createBrowserRouter([{ element: <App children={<Outlet />} />, children: routes }])

export const Routes = () => {
  return <RouterProvider router={router} />
}
