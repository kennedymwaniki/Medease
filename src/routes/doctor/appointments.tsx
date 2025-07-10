import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/doctor/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doctor/appointments"!</div>
}
