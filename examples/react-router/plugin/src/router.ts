// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

type Path =
  | `/`
  | `/about`
  | `/login`
  | `/posts`
  | `/posts/:id`
  | `/posts/:id/:pid?`
  | `/posts/:id/deep`
  | `/register`
  | `/splat/${string}`

type Params = {
  '/posts/:id': { id: string }
  '/posts/:id/:pid?': { id: string; pid?: string }
  '/posts/:id/deep': { id: string }
}

type ModalPath = `/modal`

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
