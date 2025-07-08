import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/medication')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/medication"!</div>
}
