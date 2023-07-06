export const template = `// Generouted, changes to this file will be overriden
import { Fragment } from 'react'// actions-imports// loaders-imports
import { lazy, Outlet, Router, RootRoute, Route, RouterProvider } from '@tanstack/router'

// imports

// modules// actions// loaders

const config = root.addChildren([
  // config,
  _404,
])

const router = new Router({ routeTree: config })
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}

// actions-client// actions-type
// loaders-client// loaders-type
`
