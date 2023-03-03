import React, { Fragment } from 'react'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'

const MODALS = import.meta.glob<{ default: () => JSX.Element }>('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const modalRoutes = Object.keys(MODALS).reduce<Record<string, () => JSX.Element>>((modals, modal) => {
  const path = modal
    .replace(/^\.?\/src\/pages\/|^\/pages\/|\.(jsx|tsx)$/g, '')
    .replace(/\+/g, '')
    .replace(/(\/)?index/g, '')
    .replace(/\./g, '/')

  return { ...modals, [`/${path}`]: MODALS[modal].default }
}, {})

export const modals = <ModalPath extends string, Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type Options<P> = NavigateOptions & (P extends ParamPath ? { at: P; params: Params[P] } : { at: P; params?: never })

  return {
    useModals: () => {
      const location = useLocation()
      const navigate = useNavigate()

      return {
        current: location.state?.modal || '',
        open: <P extends Path>(path: ModalPath, options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          navigate(at || location.pathname, { ...opts, state: { ...location.state, ...state, modal: path } })
        },
        close: <P extends Path>(options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          navigate(at || location.pathname, { ...opts, state: { ...location.state, ...state, modal: '' } })
        },
      }
    },
  }
}

export const Modals = () => {
  const { current } = modals().useModals()
  const Modal = modalRoutes[current] || Fragment
  return <Modal />
}
