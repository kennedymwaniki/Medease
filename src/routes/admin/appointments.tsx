import { createFileRoute } from '@tanstack/react-router'
import AppointmentsTable from '@/components/admincomponents/AppointmentsTable'

export const Route = createFileRoute('/admin/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <AppointmentsTable />
    </div>
  )
}
