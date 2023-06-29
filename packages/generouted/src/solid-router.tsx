/** @jsxImportSource solid-js */
import { Component, createMemo, ErrorBoundary, ParentProps } from 'solid-js'
import { RouteDataFunc, RouteDefinition, Router, useLocation, useRoutes } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type Module = { default: Component; Loader?: RouteDataFunc; Catch?: Component<{ error: any; reset: () => void }> }
type RouteDef = { path?: string; component?: Component; children?: RouteDef[] }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Component>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteDef, Module>(ROUTES, (module) => {
  const Component = module?.default || Fragment
  const Page = module?.Catch
    ? () => <ErrorBoundary fallback={(error, reset) => module?.Catch?.({ error, reset })} children={<Component />} />
    : Component
  return { component: Page, data: module?.Loader || null }
})

const Fragment = (props: ParentProps) => props?.children
const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment
const Modals = () => createMemo(() => modalRoutes[useLocation<any>().state?.modal || ''] || Fragment) as any

export const routes = [...regularRoutes, { path: '*', component: NotFound }] as RouteDefinition[]

export const Routes = () => {
  const Routes = useRoutes(routes)

  return (
    <Router>
      <App>
        <Routes />
        <Modals />
      </App>
    </Router>
  )
}
