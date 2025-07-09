import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/doctors')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/patient/doctors"!</div>
}
