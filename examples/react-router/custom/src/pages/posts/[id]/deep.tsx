import { Params } from '@/router'

export const Crumb = (props: { params: Params['/posts/:id/deep'] }) => {
  return `Posts ${props.params.id} Deep`
}

export default function IdDeep() {
  return <h1>IdDeep</h1>
}
