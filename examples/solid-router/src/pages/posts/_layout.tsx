import { ParentProps } from 'solid-js'

export const Catch = () => 'Error'

export default function Posts(props: ParentProps) {
  return (
    <div>
      <h1>Posts Layout</h1>
      {props.children}
    </div>
  )
}
