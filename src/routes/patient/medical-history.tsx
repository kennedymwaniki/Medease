import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/medical-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/patient/medical-history"!</div>
}
