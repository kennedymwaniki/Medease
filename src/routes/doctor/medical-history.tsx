import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/doctor/medical-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doctor/medical-history"!</div>
}
