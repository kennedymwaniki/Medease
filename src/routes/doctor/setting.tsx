import { createFileRoute } from '@tanstack/react-router'
import { PushNotificationSetup } from '@/components/PushNotificationSetup'

export const Route = createFileRoute('/doctor/setting')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PushNotificationSetup />
    </div>
  )
}
