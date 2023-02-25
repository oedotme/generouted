export const template = `// Generouted, changes to this file will be overriden
/* eslint-disable react/no-children-prop */

import { Fragment, lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { components, hooks, utils } from '@generouted/react-router/client'

// imports

// modules

const config = // config

// types

export const routes = [{ element: <App />, children: [...config, { path: '*', element: <NoMatch /> }] }]
export const Routes = () => <RouterProvider router={createBrowserRouter(routes)} />
export const { Link, Navigate } = components<Path, Params>()
export const { useNavigate, useParams } = hooks<Path, Params>()
export const { rediect } = utils<Path, Params>()
`
