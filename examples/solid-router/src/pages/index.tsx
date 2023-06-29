export const Catch = (props: { error: Error; reset: () => void }) => (
  <div>
    Couldn't load <button onClick={props.reset}>reset</button>
    <pre>{props.error.toString()}</pre>
  </div>
)

export default function Home() {
  return <h1>Home - Basic</h1>
}
