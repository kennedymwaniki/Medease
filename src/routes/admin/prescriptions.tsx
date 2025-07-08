import { createFileRoute } from '@tanstack/react-router'
import PrescriptionsTable from '@/components/admincomponents/PrescriptionsTable'

export const Route = createFileRoute('/admin/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PrescriptionsTable />
    </div>
  )
}
