const z = require('zod')
const { existsSync } = require('fs')
const capitalize = (id) => id.replace(/\b[\w]/, (character) => character.toUpperCase())

const prettier = './node_modules/.bin/prettier'

const format = (file) => {
  if (!existsSync(prettier) || !existsSync(file)) return
  exec(`${prettier} --write ${file}`)
}

const defaultOptions = {
  output: './src/routes.gen.tsx',
  format: true,
}

const optionsSchema = z.object({
  output: z.string().optional(),
  format: z.boolean().optional(),
})

const template = `// Generouted, changes to this file will be overriden
import Link from 'next/link'
import { Router, useRouter as _useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { UrlObject } from 'url'

interface TypeSafeUrlObject extends UrlObject {
  pathname?: Path | null | undefined
}
type ValidTypeSafeRoutes = TypeSafeUrlObject | Path

interface TypeSafeRouter extends Router {
  push(url: ValidTypeSafeRoutes, as?: ValidTypeSafeRoutes, options?: Parameters<Router['push']>[2]): Promise<boolean>
}

interface TypeSafeLinkProps extends ComponentProps<typeof Link> {
  href: ValidTypeSafeRoutes
}

export const useInternalRouter = () => _useRouter() as TypeSafeRouter
export const InternalLink = ({ children, ...props }: TypeSafeLinkProps) => <Link {...props}>{children}</Link>

// types


`

module.exports = {
  defaultOptions,
  template,
  format,
  optionsSchema,
  capitalize,
}
