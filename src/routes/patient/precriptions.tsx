import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/precriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/patient/pr</div>
}
