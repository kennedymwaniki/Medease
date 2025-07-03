import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/patients"!</div>
}
