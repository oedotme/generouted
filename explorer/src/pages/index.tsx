import { Container } from '@/components'

export const Loader = () => 'Route loader'
export const Action = () => 'Route action'
export const Catch = () => 'Route error'

const source = import.meta.url

export default function Home() {
  return <Container source={source} />
}
