import { useMatches } from 'react-router-dom'

export default function Index() {
  const match = useMatches()?.find((match) => match.pathname === '/posts')
  const data = match?.data

  return (
    <>
      <h1>Posts Index</h1>

      <code>
        Loader data
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </>
  )
}
