import { createFileRoute } from '@tanstack/react-router'
import PatientPrescriptionTable from '@/components/patient/PatientPrescriptionTable'

export const Route = createFileRoute('/patient/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PatientPrescriptionTable />
    </div>
  )
}
