import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/doctor/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doctor/chat"!</div>
}
