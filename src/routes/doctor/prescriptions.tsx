import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/doctor/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doctor/prescriptions"!</div>
}
