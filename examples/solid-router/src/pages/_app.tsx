import { ParentProps } from 'solid-js'
import { A } from '@solidjs/router'

export default function App(props: ParentProps) {
  return (
    <section style={{ margin: '24px' }}>
      <header style={{ display: 'flex', gap: '24px' }}>
        <A href="/">Home</A>
        <A href="/about">About</A>
      </header>

      <main>{props.children}</main>
    </section>
  )
}
