import { Fragment } from 'react'
import { createReactRouter, createRouteConfig, lazy, RouterProvider } from '@tanstack/react-router'

import App from './pages/_app'
import NoMatch from './pages/404'

const root = createRouteConfig({ component: App || Fragment })
const _404 = root.createRoute({ path: '*', component: NoMatch || Fragment })
const posts_layout = root.createRoute({ path: 'posts', component: lazy(() => import('./pages/posts/_layout')) })
const about = root.createRoute({ path: 'about', component: lazy(() => import('./pages/about')) })
const index = root.createRoute({ path: '/', component: lazy(() => import('./pages/index')) })
const postsid = posts_layout.createRoute({ path: '$id', component: lazy(() => import('./pages/posts/[id]')) })
const postsindex = posts_layout.createRoute({ path: '/', component: lazy(() => import('./pages/posts/index')) })

const config = root.addChildren([posts_layout.addChildren([postsindex, postsid]), about, index, _404])

const router = createReactRouter({ routeConfig: config, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

export const Routes = () => <RouterProvider router={router} />
