import { createFileRoute } from '@tanstack/react-router'
import MedEaseAssistant from '@/components/MedEaseAssistant'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <MedEaseAssistant />
    </div>
  )
}
