import { Fragment } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import type { ActionFunction, RouteObject, LoaderFunction } from 'react-router-dom'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader: LoaderFunction; Action: ActionFunction; Catch: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Omit<Module, 'Action'>>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteObject, Partial<Module>>(ROUTES, (module, key) => {
  const index = /index\.(jsx|tsx)$/.test(key) && !key.includes('pages/index') ? { index: true } : {}

  return {
    ...index,
    Component: module?.default,
    ErrorBoundary: module?.Catch,
    loader: module?.Loader,
    action: module?.Action,
  }
})

const _app = preservedRoutes?.['_app']
const _404 = preservedRoutes?.['404']

const app = { Component: _app?.default || Outlet, ErrorBoundary: _app?.Catch, loader: _app?.Loader }
const fallback = { path: '*', Component: _404?.default || Fragment }

export const routes: RouteObject[] = [{ ...app, children: [...regularRoutes, fallback] }]
export const Routes = () => <RouterProvider router={createBrowserRouter(routes)} />

export const Modals = () => {
  const current = useLocation().state?.modal
  const Modal = modalRoutes[current] || Fragment
  return <Modal />
}
