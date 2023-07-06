import { useMatch } from '@tanstack/router'

export default function Id() {
  const { params } = useMatch({ from: '/posts/$id' })

  return <h1>{params.id}</h1>
}
