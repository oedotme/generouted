/** @jsxImportSource solid-js */
import { Component, ParentProps } from 'solid-js'
import { RouteDataFunc, RouteDefinition, Router, useRoutes } from '@solidjs/router'

import { generatePreservedRoutes, generateRegularRoutes } from './core'

type Module = { default: Component; Loader: RouteDataFunc }
type RouteDef = { path?: string; component?: Component; children?: RouteDef[] }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

const preservedRoutes = generatePreservedRoutes<Component>(PRESERVED)

const regularRoutes = generateRegularRoutes<RouteDef, Module>(ROUTES, (module) => ({
  component: module?.default || Fragment,
  data: module?.Loader || null,
}))

const Fragment = (props: ParentProps) => props.children
const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment

export const routes = [...regularRoutes, { path: '*', component: NotFound }] as RouteDefinition[]

export const Routes = () => {
  const Routes = useRoutes(routes)

  return (
    <Router>
      <App>
        <Routes />
      </App>
    </Router>
  )
}
