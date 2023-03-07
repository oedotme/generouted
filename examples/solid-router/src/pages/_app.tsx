import { ParentProps } from 'solid-js'

import { A, useNavigate } from '../router'

export default function App(props: ParentProps) {
  const navigate = useNavigate()

  const a = () => navigate('/about')
  const b = () => navigate('/posts/:id/:pid?', { params: { id: 'xyz' } })

  return (
    <section style={{ margin: '24px' }}>
      <header style={{ display: 'flex', gap: '24px' }}>
        <A href="/">Home</A>
        <A href="/about">About</A>
        <A href="/posts/:id" params={{ id: 'xyz' }}>
          Post by Id
        </A>
      </header>

      <main>{props.children}</main>
    </section>
  )
}
