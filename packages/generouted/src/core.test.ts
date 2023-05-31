import { expect, test } from 'vitest'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

test('modal routes generation', () => {
  const modules = {
    '/src/pages/+info.tsx': {},
    '/src/pages/+index.tsx': {},
    '/src/pages/+checkout/+index.tsx': {},
    '/src/pages/+checkout/+review.tsx': {},
  }

  expect(generateModalRoutes(modules)).toStrictEqual({
    '/info': undefined,
    '/': undefined,
    '/checkout': undefined,
    '/checkout/review': undefined,
  })
})

test('preserved routes generation', () => {
  const modules = {
    '/src/pages/404.tsx': {},
    '/src/pages/_app.tsx': {},
  }

  expect(generatePreservedRoutes(modules)).toStrictEqual({
    '404': undefined,
    _app: undefined,
  })
})

test('regular routes generation', () => {
  const modules = {
    '/src/pages/(auth)/_layout.tsx': {},
    '/src/pages/(auth)/login.tsx': {},
    '/src/pages/(auth)/register.tsx': {},
    '/src/pages/about.tsx': {},
    '/src/pages/blog.w.o.layout.tsx': {},
    '/src/pages/blog/[slug].tsx': {},
    '/src/pages/blog/_layout.tsx': {},
    '/src/pages/blog/index.tsx': {},
    '/src/pages/blog/tags.tsx': {},
    '/src/pages/docs/-[lang]/index.tsx': {},
    '/src/pages/docs/-[lang]/resources.tsx': {},
    '/src/pages/index.tsx': {},
  }

  expect(generateRegularRoutes(modules, () => ({}))).toStrictEqual([
    {
      path: 'docs',
      children: [
        {
          path: ':lang?',
          children: [
            { path: 'resources', id: 'docs/-[lang]/resources' },
            { path: '/', id: 'docs/-[lang]/index' },
          ],
        },
      ],
    },
    {
      path: 'blog',
      id: 'blog',
      children: [
        { path: 'tags', id: 'blog/tags' },
        { path: '/', id: 'blog/index' },
        { path: ':slug', id: 'blog/[slug]' },
      ],
    },
    {
      id: '(auth)',
      children: [
        { path: 'register', id: '(auth)/register' },
        { path: 'login', id: '(auth)/login' },
      ],
    },
    { path: 'about', id: 'about' },
    { path: 'blog/w/o/layout', id: 'blog.w.o.layout' },
    { path: '/', id: 'index' },
  ])
})
