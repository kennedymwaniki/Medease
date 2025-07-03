import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/doctors')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doctors"!</div>
}
