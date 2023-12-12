/** @jsxImportSource solid-js */
import { Component, createMemo, ErrorBoundary, lazy, ParentProps, Suspense } from 'solid-js'
import { RouteDefinition, RouteLoadFunc, RouteLoadFuncArgs, Router, useLocation } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type CatchProps = { error: any; reset: () => void }
type Module = { default: Component; Loader?: RouteLoadFunc; Catch?: Component<CatchProps>; Pending?: Component }
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
  const Page = (props: any) => <Suspense fallback={<Pending />} children={<Element {...props} />} />
  const Component = (props: any) => (
    <ErrorBoundary fallback={(error, reset) => Catch({ error, reset })} children={<Page {...props} />} />
  )

  return {
    component: Component,
    load: (args: RouteLoadFuncArgs) => module().then((mod) => mod?.Loader?.(args) || undefined),
  }
})
const _app = preservedRoutes?.['_app']
const _404 = preservedRoutes?.['404']

const Fragment = (props: ParentProps) => props?.children
const Element = _app?.default || Fragment
const Pending = _app?.Pending || Fragment
const Catch = preservedRoutes?.['_app']?.Catch

const App = (props: any) => (
  <ErrorBoundary fallback={(error, reset) => Catch?.({ error, reset })}>
    {_app?.Pending ? <Suspense fallback={<Pending />} children={<Element {...props} />} /> : <Element {...props} />}
  </ErrorBoundary>
)

const app: RouteDefinition = { path: '', component: _app?.default ? App : Fragment, load: _app?.Loader || undefined }
const fallback: RouteDefinition = { path: '*', component: _404?.default || Fragment }

export const routes = [{ ...app, children: [...regularRoutes, fallback] }] as RouteDefinition[] // @ts-expect-error
export const Routes = () => <Router children={routes} />
export const Modals = () => createMemo(() => modalRoutes[useLocation<any>().state?.modal || ''] || Fragment) as any
