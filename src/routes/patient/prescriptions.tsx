import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/patient/prescriptions"!</div>
}
