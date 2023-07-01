import { Fragment, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import type { ActionFunction, RouteObject, LoaderFunction } from 'react-router-dom'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader?: LoaderFunction; Action?: ActionFunction; Catch?: Element; Pending?: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Omit<Module, 'Action'>>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteObject, () => Promise<Partial<Module>>>(ROUTES, (module, key) => {
  const index = /index\.(jsx|tsx)$/.test(key) && !key.includes('pages/index') ? { index: true } : {}

  return {
    ...index,
    lazy: async () => {
      const Element = (await module())?.default || Fragment
      const Pending = (await module())?.Pending
      const Page = () => (Pending ? <Suspense fallback={<Pending />} children={<Element />} /> : <Element />)

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

const Element = _app?.default || Fragment
const App = () => (_app?.Pending ? <Suspense fallback={<_app.Pending />} children={<Element />} /> : <Element />)

const app = { Component: _app?.default ? App : Outlet, ErrorBoundary: _app?.Catch, loader: _app?.Loader }
const fallback = { path: '*', Component: _404?.default || Fragment }

export const routes: RouteObject[] = [{ ...app, children: [...regularRoutes, fallback] }]
export const Routes = () => <RouterProvider router={createBrowserRouter(routes)} />

export const Modals = () => {
  const Modal = modalRoutes[useLocation().state?.modal] || Fragment
  return <Modal />
}
