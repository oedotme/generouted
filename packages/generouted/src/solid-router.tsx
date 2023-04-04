/** @jsxImportSource solid-js */
import { Component, createMemo, ParentProps } from 'solid-js'
import { RouteDataFunc, RouteDefinition, Router, useLocation, useRoutes } from '@solidjs/router'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes, generatePathForGroup } from './core'

type Module = { default: Component; Loader: RouteDataFunc }
type RouteDef = { path?: string; component?: Component; children?: RouteDef[]; id?: string }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Component>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

const regularRoutes = generateRegularRoutes<RouteDef, Module>(ROUTES, (module) => ({
  component: module?.default || Fragment,
  data: module?.Loader || null,
}))
regularRoutes.forEach((route) => generatePathForGroup(route))

const Fragment = (props: ParentProps) => props?.children
const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment
const Modals = () => createMemo(() => modalRoutes[useLocation<{ modal: string }>().state?.modal || ''] || Fragment)

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
