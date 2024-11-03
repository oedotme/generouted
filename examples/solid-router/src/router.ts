// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks } from '@generouted/solid-router/client'

export type Path =
  | `/`
  | `/:lang?/lang`
  | `/about`
  | `/login`
  | `/posts`
  | `/posts/:id`
  | `/posts/:id/:pid?`
  | `/posts/:id/deep`
  | `/register`

export type Params = {
  '/:lang?/lang': { lang?: string }
  '/posts/:id': { id: string }
  '/posts/:id/:pid?': { id: string; pid?: string }
  '/posts/:id/deep': { id: string }
}

export type ModalPath = `/modal`

export const { A, Navigate } = components<Path, Params>()
export const { useMatch, useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
