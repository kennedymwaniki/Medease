import { createFileRoute } from '@tanstack/react-router'
import PatientPaymentsTable from '@/components/patient/PatientPaymentstable'

export const Route = createFileRoute('/patient/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PatientPaymentsTable />
    </div>
  )
}
