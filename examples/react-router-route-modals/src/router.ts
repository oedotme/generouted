// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/about`
  | `/gallery`
  | `/gallery/:id`
  | `/login`
  | `/posts`
  | `/posts/:id`
  | `/posts/:id/:pid?`
  | `/posts/:id/deep`
  | `/register`
  | `/splat/*`

export type ParameterizedPaths = {
  '/gallery/:id': `/gallery/${string}`
  '/posts/:id': `/posts/${string}`
  '/posts/:id/:pid?': `/posts/${string}${`/${string}` | ''}`
  '/posts/:id/deep': `/posts/${string}/deep`
  '/splat/*': `/splat/${string}`
}

export type Params = {
  '/gallery/:id': { id: string }
  '/posts/:id': { id: string }
  '/posts/:id/:pid?': { id: string; pid?: string }
  '/posts/:id/deep': { id: string }
  '/splat/*': { '*': string }
}

export type ModalPath = `/modal`

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
