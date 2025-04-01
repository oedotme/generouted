/** @jsxImportSource solid-js */
import { Component, createMemo, ErrorBoundary, lazy, ParentProps, Show, Suspense } from 'solid-js'
import { RouteDefinition, RouteLoadFunc, RouteLoadFuncArgs, Router, useLocation } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type CatchProps = { error: any; reset: () => void }
type Module = { default: Component; Loader?: RouteLoadFunc; Catch?: Component<CatchProps>; Pending?: Component }
type Route = { path?: string; component?: Component; children?: Route[] }


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

const preservedRoutes = generatePreservedRoutes<Module>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<Route, () => Promise<Module>>(ROUTES, (module) => {
  const Default = lazy(module)
  const Pending = lazy(() => module().then((module) => ({ default: module?.Pending || Fragment })))
  const Catch = lazy(() => module().then((module) => ({ default: module?.Catch || Fragment })))
  const Page = (props: any) => <Suspense fallback={<Pending />} children={<Default {...props} />} />
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
