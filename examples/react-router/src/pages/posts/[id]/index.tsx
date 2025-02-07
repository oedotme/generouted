import { useMatch } from 'react-router'

import { useParams } from '@/router'

export default function Id() {
  // const { params } = useMatch('/posts/$id')
  const { id } = useParams('/posts/:id')
  const match = useMatch('/posts/:id')

  return <h1>Id</h1>
}
