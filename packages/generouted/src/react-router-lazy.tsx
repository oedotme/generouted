import { Fragment, JSX, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router'
import type { ActionFunction, RouteObject, LoaderFunction } from 'react-router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader?: LoaderFunction; Action?: ActionFunction; Catch?: Element; Pending?: Element }

let PRESERVED: Record<string, Module>
let MODALS: Record<string, Module>
let ROUTES: Record<string, () => Promise<Module>>

if (typeof import.meta.env === 'object') {
  PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
  MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
  ROUTES = import.meta.glob<Module>([
    '/src/pages/**/[\\w[-]*.{jsx,tsx,mdx}',
    '!/src/pages/**/(_!(layout)*(/*)?|_app|404)*',
  ])
} else if (typeof __webpack_require__ === 'function') {
  const preservedContext = import.meta.webpackContext('/src/pages/', {
    regExp: /\/(_app|404)\.(jsx|tsx)$/i,
    mode: 'sync'
  })

  PRESERVED = preservedContext.keys().reduce<Record<string, Module>>((acc, key) => {
    acc[`/src/pages/${key.toString().replace('./', '')}`] = preservedContext(key) as Module;
    return acc;
  }, {})

  const modalsContext = import.meta.webpackContext('/src/pages/', {
    recursive: true,
    regExp: /\/[+][^/]*\.(jsx|tsx)$/i,
    mode: 'sync'
  })

  MODALS = modalsContext.keys().reduce<Record<string, Module>>((acc, key) => {
    acc[`/src/pages/${key.toString().replace('./', '')}`] = modalsContext(key) as Module;
    return acc;
  }, {})

  const routesContext = import.meta.webpackContext('/src/pages/', {
    recursive: true,
    regExp: /\/[\w[-][^/]*\.(jsx|tsx|mdx)$/i,
    mode: 'lazy',
    exclude: /\/((_(?!layout)|_app|404).*)\.(jsx|tsx|mdx)$/i
  })

  ROUTES = routesContext.keys().reduce<Record<string, () => Promise<Module>>>((acc, key) => {
    acc[`/src/pages/${key.toString().replace('./', '')}`] = routesContext(key) as () => Promise<Module>;
    return acc;
  }, {})
} else {
  throw new Error('Current Bundler is not supported by Generouted. Please use Vite, Webpack or Rspack.')
}

const preservedRoutes = generatePreservedRoutes<Omit<Module, 'Action'>>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteObject, () => Promise<Partial<Module>>>(ROUTES, (module, key) => {
  const index = /index\.(jsx|tsx|mdx)$/.test(key) && !key.includes('pages/index') ? { index: true } : {}

  return {
    ...index,
    lazy: async () => {
      const Default = (await module())?.default || Fragment
      const Pending = (await module())?.Pending
      const Page = () => (Pending ? <Suspense fallback={<Pending />} children={<Default />} /> : <Default />)

      return {
        Component: Page,
        ErrorBoundary: (await module())?.Catch,
        loader: (await module())?.Loader,
        action: (await module())?.Action,
      }
    },
  }
})

const _app = preservedRoutes?.['_app']
const _404 = preservedRoutes?.['404']

const Default = _app?.default || Outlet

const Modals_ = () => {
  const Modal = modalRoutes[useLocation().state?.modal] || Fragment
  return <Modal />
}

const Layout = () => (
  <>
    <Default /> <Modals_ />
  </>
)

const App = () => (_app?.Pending ? <Suspense fallback={<_app.Pending />} children={<Layout />} /> : <Layout />)

const app = { Component: _app?.default ? App : Layout, ErrorBoundary: _app?.Catch, loader: _app?.Loader }
const fallback = { path: '*', Component: _404?.default || Fragment }

export const routes: RouteObject[] = [{ ...app, children: [...regularRoutes, fallback] }]
let router: ReturnType<typeof createBrowserRouter>
const createRouter = () => ((router ??= createBrowserRouter(routes)), router)
export const Routes = () => <RouterProvider router={createRouter()} />

/** @deprecated `<Modals />` is no longer needed, it will be removed in future releases */
export const Modals = () => (console.warn('[generouted] `<Modals />` will be removed in future releases'), null)
