import { createFileRoute } from '@tanstack/react-router'
import { PushNotificationSetup } from '@/components/PushNotificationSetup'

export const Route = createFileRoute('/admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-8">
      <PushNotificationSetup />
    </div>
  )
}
