import { useMatch } from 'react-router-dom'

import { useParams, Params } from '@/router'

export const Crumb = (props: { params: Params['/posts/:id'] }) => {
  return `Posts ${props.params.id}`
}

export default function Id() {
  // const { params } = useMatch('/posts/$id')
  const { id } = useParams('/posts/:id')
  const match = useMatch('/posts/:id')

  return <h1>Id</h1>
}
