export const Loader = () => console.log('Route loader')
export const Action = () => console.log('Route action')

export const Pending = () => <div>Route pending</div>
export const Catch = () => <div>Route error</div>

export default function Home() {
  return <h1>Home - Basic</h1>
}
