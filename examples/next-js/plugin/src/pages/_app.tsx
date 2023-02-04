import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { InternalLink, useInternalRouter } from '../routes.gen'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const ActionButtonOnClient = () => {
  const router = useInternalRouter()
  const handleClick = () => router.push('/posts/:id')

  return <button onClick={handleClick}>Use Router</button>
}

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <section style={{ margin: 24 }}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header style={{ display: 'flex', gap: 24 }}>
        <InternalLink href="/">Home</InternalLink>
        <InternalLink href={{ pathname: '/about' }}>About</InternalLink>
        <InternalLink href={{ pathname: '/explorer/dsadsa/dsada' }}>About</InternalLink>
        <InternalLink href="/posts">Posts</InternalLink>
        {/* <InternalLink href="/posts/:id/:pid?" params={{ id: '1', pid: '2' }}>
          Posts by id/pid
        </InternalLink>
        <InternalLink href="/posts/:id" params={{ id: 'id' }}>
          Posts by id
        </InternalLink> */}
        {isClient && <ActionButtonOnClient />}
      </header>

      <main>
        <Component {...pageProps} />{' '}
      </main>
    </section>
  )
}
