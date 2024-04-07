// Generouted, changes to this file will be overriden
import { Fragment } from 'react'
import {
  Outlet,
  RouterProvider,
  createLazyRoute,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import App from './pages/_app'
import NoMatch from './pages/404'

const root = createRootRoute({ component: App || Outlet })
const _404 = createRoute({ getParentRoute: () => root, path: '*', component: NoMatch || Fragment })
const posts = createRoute({ getParentRoute: () => root, path: 'posts' }).lazy(() =>
  import('./pages/posts/_layout').then((m) => createLazyRoute('/posts')({ component: m.default })),
)
const postsindex = createRoute({ getParentRoute: () => posts, path: '/' }).lazy(() =>
  import('./pages/posts/index').then((m) => createLazyRoute('/posts')({ component: m.default })),
)
const postsid = createRoute({
  getParentRoute: () => posts,
  path: '$id',
  // @ts-ignore
  loader: (...args) => import('./pages/posts/[id]').then((m) => m.Loader(...args)),
}).lazy(() => import('./pages/posts/[id]').then((m) => createLazyRoute('/posts/$id')({ component: m.default })))
const auth = createRoute({ getParentRoute: () => root, id: 'auth' }).lazy(() =>
  import('./pages/(auth)/_layout').then((m) => createLazyRoute('/auth')({ component: m.default })),
)
const authregister = createRoute({ getParentRoute: () => auth, path: 'register' }).lazy(() =>
  import('./pages/(auth)/register').then((m) => createLazyRoute('/auth/register')({ component: m.default })),
)
const authlogin = createRoute({ getParentRoute: () => auth, path: 'login' }).lazy(() =>
  import('./pages/(auth)/login').then((m) => createLazyRoute('/auth/login')({ component: m.default })),
)
const about = createRoute({ getParentRoute: () => root, path: 'about' }).lazy(() =>
  import('./pages/about').then((m) => createLazyRoute('/about')({ component: m.default })),
)
const index = createRoute({
  getParentRoute: () => root,
  path: '/',
  // @ts-ignore
  loader: (...args) => import('./pages/index').then((m) => m.Loader(...args)),
}).lazy(() =>
  import('./pages/index').then((m) =>
    createLazyRoute('/')({ component: m.default, pendingComponent: m.Pending, errorComponent: m.Catch }),
  ),
)

const config = root.addChildren([
  posts.addChildren([postsindex, postsid]),
  auth.addChildren([authregister, authlogin]),
  about,
  index,
  _404,
])

const router = createRouter({ routeTree: config })
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
