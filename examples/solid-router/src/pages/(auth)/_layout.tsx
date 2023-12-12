import { ParentProps } from 'solid-js'

export default function Layout(props: ParentProps) {
  return (
    <div>
      <h1>Auth Layout</h1>
      {props.children}
    </div>
  )
}
