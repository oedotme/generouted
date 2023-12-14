/** @jsxImportSource solid-js */
import { Component, createMemo, ErrorBoundary, ParentProps, Suspense } from 'solid-js'
import { RouteDefinition, RouteLoadFunc, Router, useLocation } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type CatchProps = { error: any; reset: () => void }
type Module = { default: Component; Loader?: RouteLoadFunc; Catch?: Component<CatchProps>; Pending?: Component }
type RouteDef = { path?: string; component?: Component; children?: RouteDef[] }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Module>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteDef, Module>(ROUTES, (mod) => {
  const Element = mod?.default || Fragment
  const Page = (props: any) =>
    mod?.Pending ? <Suspense fallback={<mod.Pending />} children={<Element {...props} />} /> : <Element {...props} />
  const Component = (props: any) =>
    mod?.Catch ? (
      <ErrorBoundary fallback={(error, reset) => mod.Catch?.({ error, reset })} children={<Page {...props} />} />
    ) : (
      <Page {...props} />
    )
  return { component: Component, load: mod?.Loader || undefined }
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

export const routes: RouteDefinition[] = [{ ...app, children: [...regularRoutes, fallback] }]
export const Routes = () => <Router>{routes}</Router>
export const Modals = () => createMemo(() => modalRoutes[useLocation<any>().state?.modal || ''] || Fragment) as any
