import { useMatch } from '@solidjs/router'

import { useParams } from '../../../router'

export default function Id() {
  // const { params } = useMatch('/posts/$id')
  const { id } = useParams('/posts/:id')
  console.log({ id })
  const match = useMatch(() => '/posts/:id')
  console.log({ match: match()?.params.d })

  return <h1>Id</h1>
}
