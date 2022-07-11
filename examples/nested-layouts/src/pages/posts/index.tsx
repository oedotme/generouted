import { useMatch } from '@tanstack/react-location'

export default function Index() {
  const { data } = useMatch()

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
