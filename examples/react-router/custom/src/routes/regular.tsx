import { FunctionComponent, lazy, Suspense } from 'react'
import { useRouteError } from 'react-router-dom'
import type { ActionFunction, RouteObject, LoaderFunction } from 'react-router-dom'

import { generateRegularRoutes } from 'generouted/core'

type Element = () => JSX.Element
export type Module = {
  default: FunctionComponent
  Loader: LoaderFunction
  Action: ActionFunction
  Catch: Element
  Crumb?: FunctionComponent<{ params: any }> | string
}

const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[]*.{jsx,tsx}', '!**/(_app|404).*', '!**/components/*.tsx'])

const DefaultCatch = () => {
  throw useRouteError()
}

export const regularRoutes = generateRegularRoutes<RouteObject, () => Promise<Module>>(ROUTES, (module, key) => {
  const Element = lazy(module)
  const Catch = lazy(() => module().then((module) => ({ default: module.Catch || DefaultCatch })))
  const index = /index\.(jsx|tsx)$/.test(key) && !key.includes('pages/index') ? { index: true } : {}

  return {
    ...index,
    element: <Suspense fallback={null} children={<Element />} />,
    loader: (...args) => module().then((mod) => mod?.Loader?.(...args) || null),
    action: (...args) => module().then((mod) => mod?.Action?.(...args) || null),
    errorElement: <Suspense fallback={null} children={<Catch />} />,
    handle: module().then((mod) => ({
      Crumb: mod.Crumb,
      displayName: mod.default.displayName ?? '',
    })),
  }
})
