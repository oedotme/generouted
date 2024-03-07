import { AnchorProps as AProps, NavigateOptions as NavOptions, NavigateProps as NavProps } from '@solidjs/router'

type ComponentProps<Path extends string, Params extends Record<string, any>> = Path extends keyof Params
  ? { href: Path; params: Params[Path] }
  : { href: Path; params?: never }

export type AnchorProps<Path extends string, Params extends Record<string, any>> = Omit<AProps, 'href'> &
  ComponentProps<Path, Params>

export type NavigateProps<Path extends string, Params extends Record<string, any>> = Omit<NavProps, 'href'> &
  ComponentProps<Path, Params>

export type NavigateOptions<Path extends string, Params extends Record<string, any>> = Path extends keyof Params
  ? [Partial<NavOptions> & { params: Params[Path] }]
  : [Partial<NavOptions> & { params?: never }] | []
