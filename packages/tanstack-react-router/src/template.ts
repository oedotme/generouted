export const template = `// Generouted, changes to this file will be overriden
import { Fragment } from 'react'
import { Outlet, RouterProvider, createLazyRoute, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

// imports

// modules

const config = root.addChildren([
  // config,
  _404,
])

const router = createRouter({ routeTree: config })
export const routes = config
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
`
