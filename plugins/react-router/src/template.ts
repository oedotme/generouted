export const template = `// Generouted, changes to this file will be overriden
import { Fragment, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { components, hooks } from '@generouted/react-router/client'

// imports

// modules

const config = // config

export const routes = [...config, { path: '*', element: <NoMatch /> }]
const router = createBrowserRouter([{ element: <App children={<Outlet />} />, children: routes }])

// types

export const Routes = () => <RouterProvider router={router} />
export const { Link, Navigate } = components<Path, Params>()
export const { useNavigate, useParams } = hooks<Path, Params>()
`
