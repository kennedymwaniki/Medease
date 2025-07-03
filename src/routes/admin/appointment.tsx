import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/appointment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/appointment"!</div>
}
