import { Outlet } from 'react-router'

import { Container } from '@/components'

const source = import.meta.url

export default function BlogLayout() {
  return (
    <Container source={source}>
      <Outlet />
    </Container>
  )
}
