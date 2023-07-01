/** @jsxImportSource solid-js */
import { Component, createMemo, ErrorBoundary, lazy, ParentProps, Suspense } from 'solid-js'
import { Outlet, Router, useLocation, useRoutes } from '@solidjs/router'
import type { RouteDataFunc, RouteDataFuncArgs, RouteDefinition } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type CatchProps = { error: any; reset: () => void }
type Module = { default: Component; Loader?: RouteDataFunc; Catch?: Component<CatchProps>; Pending?: Component }
type Route = { path?: string; component?: Component; children?: Route[] }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Module>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<Route, () => Promise<Module>>(ROUTES, (module) => {
  const Element = lazy(module)
  const Pending = lazy(() => module().then((module) => ({ default: module?.Pending || Fragment })))
  const Catch = lazy(() => module().then((module) => ({ default: module?.Catch || Fragment })))
  const Page = () => <Suspense fallback={<Pending />} children={<Element />} />
  const Component = () => <ErrorBoundary fallback={(error, reset) => Catch({ error, reset })} children={<Page />} />

  return {
    component: Component,
    data: (args: RouteDataFuncArgs) => module().then((mod) => mod?.Loader?.(args) || null),
  }
})
const _app = preservedRoutes?.['_app']
const _404 = preservedRoutes?.['404']

const Fragment = (props: ParentProps) => props?.children
const Element = _app?.default || Fragment
const Pending = _app?.Pending || Fragment
const Catch = preservedRoutes?.['_app']?.Catch

const App = () => (
  <ErrorBoundary fallback={(error, reset) => Catch?.({ error, reset })}>
    {_app?.Pending ? <Suspense fallback={<Pending />} children={<Element />} /> : <Element />}
  </ErrorBoundary>
)

const app = { path: '', component: _app?.default ? App : Outlet, data: _app?.Loader || null }
const fallback = { path: '*', component: _404?.default || Fragment }

export const routes = [{ ...app, children: [...regularRoutes, fallback] }] as RouteDefinition[]
export const Routes = () => <Router children={useRoutes(routes)()} />
export const Modals = () => createMemo(() => modalRoutes[useLocation<any>().state?.modal || ''] || Fragment) as any
