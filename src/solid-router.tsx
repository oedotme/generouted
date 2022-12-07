/** @jsxImportSource solid-js */
import { Component, lazy, ParentProps } from 'solid-js'
import { RouteDataFunc, RouteDataFuncArgs, RouteDefinition, Router, useRoutes } from '@solidjs/router'

import { generatePreservedRoutes, generateRegularRoutes } from './core'

type Module = { default: Component; Loader: RouteDataFunc }
type Route = { path?: string; component?: Component; children?: Route[] }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>(['/src/pages/**/[\\w[]*.{jsx,tsx}', '!**/(_app|404).*'])

const preservedRoutes = generatePreservedRoutes<Component>(PRESERVED)

const regularRoutes = generateRegularRoutes<Route, () => Promise<Module>>(ROUTES, (module) => ({
  component: lazy(module),
  data: (args: RouteDataFuncArgs) => module().then((mod) => mod?.Loader?.(args) || null),
}))

const Fragment = (props: ParentProps) => <>{props.children}</>
const App = preservedRoutes?.['_app'] || Fragment
const NotFound = preservedRoutes?.['404'] || Fragment

export const routes = [...regularRoutes, { path: '*', component: <NotFound /> }] as RouteDefinition[]

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
