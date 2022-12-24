import { useMatch } from '@tanstack/react-router'

export default function Id() {
  const { params } = useMatch('/posts/$id')

  return <h1>{params.id}</h1>
}
