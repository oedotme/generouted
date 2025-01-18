import { expect, test } from 'vitest'

import { generateModalRoutes, generatePreservedRoutes, generateRegularRoutes } from './core'

test('modal routes generation', () => {
  const modules = {
    '/src/pages/(auth)/+login.tsx': {},
    '/src/pages/+info.tsx': {},
    '/src/pages/+index.tsx': {},
    '/src/pages/+checkout/+index.tsx': {},
    '/src/pages/+checkout/+review.tsx': {},
  }

  expect(generateModalRoutes(modules)).toStrictEqual({
    '/login': undefined,
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
    '404': {},
    _app: {},
  })
})

test('regular routes generation', () => {
  const modules = {
    '/src/pages/(auth)/_layout.tsx': {},
    '/src/pages/(auth)/login/_layout.tsx': {},
    '/src/pages/(auth)/login/index.tsx': {},
    '/src/pages/(auth)/in/_layout.tsx': {},
    '/src/pages/(auth)/in/index.tsx': {},
    '/src/pages/(auth)/register.tsx': {},
    '/src/pages/(external-auth)/sso.tsx': {},
    '/src/pages/_ignored-directory/components.tsx': {},
    '/src/pages/_ignored-path.tsx': {},
    '/src/pages/about.tsx': {},
    '/src/pages/blog.w.o.layout.tsx': {},
    '/src/pages/blog/-[...all].tsx': {},
    '/src/pages/blog/[slug].tsx': {},
    '/src/pages/blog/_layout.tsx': {},
    '/src/pages/blog/index.tsx': {},
    '/src/pages/blog/tags.tsx': {},
    '/src/pages/content.mdx': {},
    '/src/pages/docs/-[lang]/index.tsx': {},
    '/src/pages/docs/-[lang]/resources.tsx': {},
    '/src/pages/docs/-en/support.tsx': {},
    '/src/pages/catchall/folder/[...all]/index.tsx': {},
    '/src/pages/catchall/file/[...all].tsx': {},
    '/src/pages/index.tsx': {},
  }

  expect(generateRegularRoutes(modules, () => ({}))).toStrictEqual([
    {
      path: 'catchall',
      children: [
        {
          path: 'file',
          children: [{ path: '*', id: 'catchall/file/[...all]' }],
        },
        {
          path: 'folder',
          children: [{ path: '*', id: 'catchall/folder/[...all]/index' }],
        },
      ],
    },
    {
      path: 'docs',
      children: [
        {
          path: 'en?',
          children: [{ path: 'support', id: 'docs/-en/support' }],
        },
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
      id: 'blog/_layout',
      children: [
        { path: 'tags', id: 'blog/tags' },
        { path: '/', id: 'blog/index' },
        { path: '*?', id: 'blog/-[...all]' },
        { path: ':slug', id: 'blog/[slug]' },
      ],
    },
    {
      id: '(auth)/_layout',
      children: [
        { path: 'register', id: '(auth)/register' },
        { path: 'in', id: '(auth)/in/_layout', children: [{ path: '/', id: '(auth)/in/index' }] },
        { path: 'login', id: '(auth)/login/_layout', children: [{ path: '/', id: '(auth)/login/index' }] },
      ],
    },
    {
      id: '(external-auth)',
      children: [{ path: 'sso', id: '(external-auth)/sso' }],
    },
    { path: 'about', id: 'about' },
    { path: 'blog/w/o/layout', id: 'blog.w.o.layout' },
    { path: 'content', id: 'content' },
    { path: '/', id: 'index' },
  ])
})
