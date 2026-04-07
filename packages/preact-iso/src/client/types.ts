import { JSX } from 'preact'

export type To<Pathname = string> = { pathname: Pathname; search?: string; hash?: string }

type ComponentProps<Path extends string | To, Params extends Record<string, any>> = Path extends keyof Params
  ? { to: Path; params: Params[Path] }
  : Path extends { pathname: infer Pathname }
    ? Pathname extends keyof Params
      ? { to: To<Pathname>; params: Params[Pathname] }
      : { to: To<Pathname>; params?: never }
    : { to: Path; params?: never }

export type LinkProps<Path extends string | To, Params extends Record<string, any>> = 
  Omit<JSX.IntrinsicElements['a'], 'href'> & ComponentProps<Path, Params>

export type NavigateOptions<Path extends string | To | number, Params extends Record<string, any>> = 
  Path extends number
    ? []
    : Path extends keyof Params
      ? [{ params: Params[Path]; replace?: boolean }]
      : Path extends { pathname: infer Pathname }
        ? Pathname extends keyof Params
          ? [{ params: Params[Pathname]; replace?: boolean }]
          : [{ params?: never; replace?: boolean }] | []
        : [{ params?: never; replace?: boolean }] | [] 