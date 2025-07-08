import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/patient/profile"!</div>
}
