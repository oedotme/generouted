// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks } from '@generouted/solid-router/client'

type Path = `/` | `/:lang?/lang` | `/about` | `/posts` | `/posts/:id` | `/posts/:id/:pid?` | `/posts/:id/deep`

type Params = {
  '/:lang?/lang': { lang?: string }
  '/posts/:id': { id: string }
  '/posts/:id/:pid?': { id: string; pid?: string }
  '/posts/:id/deep': { id: string }
}

type ModalPath = `/modal`

export const { A, Navigate } = components<Path, Params>()
export const { useMatch, useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
