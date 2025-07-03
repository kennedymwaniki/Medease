import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/medication')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/patient/medication"!</div>
}
