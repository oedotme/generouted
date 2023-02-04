# Generouted + Next Js + Type-safety

## How

This integration is based on a Vite plugin to generate routes config for React Router with `generouted` conventions. This has been copied and applied to `webpack` to use it with `nextjs` The output is saved at `src/routes.gen.tsx` and gets updated with source code change.

**Note:** next dev must be running in the browser

## Open Todos

[Click here](./TODOS.md)

## Getting started

### Installation

**TODO**

```shell
pnpm add
```

### Setup

```ts
// next.config.js

/** @type {import('@generouted/next-js').Plugin} */
const GeneroutedNextJsPlugin = require('@generouted/next-js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.plugins.unshift(new GeneroutedNextJsPlugin())
    return config
  },
}

module.exports = nextConfig
```

### Type-safe navigation

Autocompletion for `InternalLink` and `useInternalRouter` exported from `src/route.gen.tsx`

```tsx
// src/pages/index.tsx
import { InternalLink, useInternalRouter } from '../routes.gen'

export default function Home() {
  const router = useInternalRouter()

  const handler = () => router.push('/posts')

  return (
    <div>
      {/** ✅ Passes  */}
      <InternalLink to="/" />
      {/** Not implemented yet, Check todos  */}
      {/** <InternalLink to="/posts/:id" params={{ id: '1' }} /> */}
      {/** <InternalLink to="/posts/:id/:pid?" params={{ id: '1' }} /> */}
      {/** <InternalLink to="/posts/:id/:pid?" params={{ id: '1', pid: 0 }} /> */}

      {/** 🔴 Error: not defined route  */}
      <InternalLink to="/not-defined-route" />

      {/** 🔴 Error: missing required params */}
      <InternalLink to="/posts/:id" />

      <h1>Home</h1>
    </div>
  )
}
```

## Examples

- [Plugin](../../examples/next-js/plugin)

## License

MIT
