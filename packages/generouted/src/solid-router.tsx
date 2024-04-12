/** @jsxImportSource solid-js */
import { Component, createMemo, ErrorBoundary, ParentProps, Show, Suspense } from 'solid-js'
import { RouteDefinition, RouteLoadFunc, Router, useLocation } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type CatchProps = { error: any; reset: () => void }
type Module = { default: Component; Loader?: RouteLoadFunc; Catch?: Component<CatchProps>; Pending?: Component }
type RouteDef = { path?: string; component?: Component; children?: RouteDef[] }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx,mdx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Module>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteDef, Module>(ROUTES, (mod) => {
  const Default = mod?.default || Fragment
  const Page = (props: any) =>
    mod?.Pending ? <Suspense fallback={<mod.Pending />} children={<Default {...props} />} /> : <Default {...props} />
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
const Default = _app?.default || Fragment
const Pending = _app?.Pending || Fragment
const Catch = preservedRoutes?.['_app']?.Catch
const Modals_ = () => createMemo(() => modalRoutes[useLocation<any>().state?.modal || ''] || Fragment) as any

const Layout = (props: ParentProps) => (
  <>
    <Default {...props} /> <Modals_ />
  </>
)

const App = (props: ParentProps) => (
  <ErrorBoundary fallback={(error, reset) => Catch?.({ error, reset })}>
    <Show when={_app?.Pending} fallback={<Layout {...props} />}>
      <Suspense fallback={<Pending />} children={<Layout {...props} />} />
    </Show>
  </ErrorBoundary>
)

const app: RouteDefinition = { path: '', component: _app?.default ? App : Layout, load: _app?.Loader || undefined }
const fallback: RouteDefinition = { path: '*', component: _404?.default || Fragment }

export const routes: RouteDefinition[] = [{ ...app, children: [...regularRoutes, fallback] }]
export const Routes = () => <Router>{routes}</Router>

/** @deprecated `<Modals />` is no longer needed, it will be removed in future releases */
export const Modals = () => (console.warn('[generouted] `<Modals />` will be removed in future releases'), null)
