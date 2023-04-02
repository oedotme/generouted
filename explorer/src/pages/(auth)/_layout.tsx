import { Outlet } from 'react-router-dom'

import { Container } from '@/components'

const source = import.meta.url

export default function Layout() {
  return (
    <Container source={source}>
      <Outlet />
    </Container>
  )
}
