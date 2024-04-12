# Generouted + React Router Custom Integration + Custom Path Example

Although it's recommended to use the default integrations, in some cases, full stack projects or monorepo tooling like Nx might require certain project structure. This example uses `src/pages` inside a `client` directory in the project root.

## What's different from the default integrations

- Source files are located at [`./client/src`](./client/src) instead of `./src` _(default)_
  - Pages located at [`./client/src/pages`](./client/src/pages) instead of `./src/pages` _(default)_

<br>

- Custom integration added at [`./client/src/routes.tsx`](./client/src/routes.tsx)
  - Based on one of [`packages/generouted/src`](/packages/generouted/src) integrations
    - Copied from [`packages/generouted/src/react-router.tsx`](/packages/generouted/src/react-router.tsx)
    - Only `import.meta.glob` patterns for routes, preserved routes and modals are updated to be prefixed with `/client`
    - Exports `<Routes />` component that's imported at app entry [`./client/src/main.tsx`](./client/src/main.tsx)

<br>

- Custom config for Vite plugin at [`./vite.config.ts`](./vite.config.ts)
  - Both `source` and `output` have the default values but prefixed with `./client`

## Preview

Run this example online via [StackBlitz](https://stackblitz.com/github.com/oedotme/generouted/tree/main/examples/react-router-custom-path):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github.com/oedotme/generouted/tree/main/examples/react-router-custom-path)
