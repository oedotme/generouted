import { LoaderFnContext, useMatch } from '@tanstack/react-router'

export const Loader = (context: LoaderFnContext) => {
  console.log({ params: context.params })
  return context.params
}

export default function Id() {
  const { params } = useMatch({ from: '/posts/$id' })

  return <h1>{params.id}</h1>
}
