import { Fragment, JSX, h } from 'preact'
import { Suspense } from 'preact/compat'
import { LocationProvider, Router, Route, lazy } from 'preact-iso'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

type Element = () => JSX.Element
type Module = { default: Element; Loader?: Function; Pending?: Element; Catch?: Element }

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob<Pick<Module, 'default'>>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob<Module>([
  '/src/pages/**/*.{jsx,tsx,mdx}',
  '!/src/pages/**/(_!(layout)*(/*)?|_app|404)*',
])

const preservedRoutes = generatePreservedRoutes<Omit<Module, 'Loader'>>(PRESERVED)
const modalRoutes = generateModalRoutes<Element>(MODALS)

type RouteProps = { path?: string; component: any; children?: RouteProps[] }

console.log('LAZY - ROUTES found:', Object.keys(ROUTES))

const regularRoutes = generateRegularRoutes<RouteProps, () => Promise<Partial<Module>>>(ROUTES, (module, key) => {
  console.log('LAZY - Processing route:', key)
  return {
    component: lazy(async () => {
      console.log('LAZY - Loading module for:', key)
      const mod = await module()
      console.log('LAZY - Module loaded:', mod)
      const Default = mod?.default || Fragment
      
      // Create a component that handles pending and error states
      const LazyComponent = (props: any) => {
        console.log('LAZY - Rendering component for:', key)
        const Page = () => (mod?.Pending ? h(Suspense, { fallback: h(mod.Pending, {}) }, h(Default, props)) : h(Default, props))
        
        if (mod?.Catch) {
          try {
            return h(Page, {})
          } catch (error) {
            return h(mod.Catch, { error })
          }
        }
        
        return h(Page, {})
      }
      
      return LazyComponent
    })
  }
})

console.log('LAZY - Generated regular routes:', JSON.stringify(regularRoutes, (key, value) => {
  if (typeof value === 'function') return '[Function]'
  return value
}, 2))

const _app = preservedRoutes?.['_app']
const _404 = preservedRoutes?.['404']

const Default = _app?.default || Fragment

const Modals_ = () => {
  // Note: preact-iso doesn't have built-in location state like react-router
  // This would need to be implemented differently, possibly with a custom context
  const Modal = Fragment // modalRoutes[/* modal state */] || Fragment
  return h(Modal, {})
}

const Layout = ({ children }: { children?: any }) => h(Fragment, {}, h(Default, {}, children), h(Modals_, {}))

const App = ({ children }: { children?: any }) => 
  _app?.Pending ? 
    h(Suspense, { fallback: h(_app.Pending, {}) }, h(Layout, {}, children)) : 
    h(Layout, {}, children)

// Convert route tree to Route components
const renderRoutes = (routes: RouteProps[]): JSX.Element[] => {
  return routes.map((route, index) => {
    const Component = route.component
    if (route.children && route.children.length > 0) {
      return h(Route, { 
        key: index,
        path: route.path, 
        component: () => h(Component, {}, renderRoutes(route.children!))
      })
    }
    return h(Route, { key: index, path: route.path, component: Component })
  })
}

const NotFound = _404?.default || (() => h('div', {}, 'Not Found'))

export const routes = regularRoutes
export const Routes = () => {
  const routeElements = renderRoutes(regularRoutes)
  
  return h(LocationProvider, {},
    h(App, {},
      h(Router, {},
        ...routeElements,
        h(Route, { default: true, component: NotFound })
      )
    )
  )
}

/** @deprecated `<Modals />` is no longer needed, it will be removed in future releases */
export const Modals = () => (console.warn('[generouted] `<Modals />` will be removed in future releases'), null)
