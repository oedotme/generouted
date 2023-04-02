import { Container } from '@/components'

const source = import.meta.url

export default function Home() {
  return <Container source={source} />
}
