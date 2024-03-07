import { LinkProps as _LinkProps, NavigateOptions as NavOptions, NavigateProps as NavProps } from 'react-router-dom'

export type To<Pathname = string> = { pathname: Pathname; search?: string; hash?: string }

type ComponentProps<Path extends string | To, Params extends Record<string, any>> = Path extends keyof Params
  ? { to: Path; params: Params[Path] }
  : Path extends { pathname: infer Pathname }
    ? Pathname extends keyof Params
      ? { to: To<Pathname>; params: Params[Pathname] }
      : { to: To<Pathname>; params?: never }
    : { to: Path; params?: never }

export type LinkProps<Path extends string | To, Params extends Record<string, any>> = Omit<_LinkProps, 'to'> &
  ComponentProps<Path, Params>

export type NavigateProps<Path extends string | To, Params extends Record<string, any>> = Omit<NavProps, 'to'> &
  ComponentProps<Path, Params>

export type NavigateOptions<Path extends string | To | number, Params extends Record<string, any>> = Path extends number
  ? []
  : Path extends keyof Params
    ? [NavOptions & { params: Params[Path] }]
    : Path extends { pathname: infer Pathname }
      ? Pathname extends keyof Params
        ? [NavOptions & { params: Params[Pathname] }]
        : [NavOptions & { params?: never }] | []
      : [NavOptions & { params?: never }] | []
