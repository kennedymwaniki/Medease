import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/notifications"!</div>
}
