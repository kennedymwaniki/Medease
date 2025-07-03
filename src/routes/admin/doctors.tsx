import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/doctors')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/doctors"!</div>
}
