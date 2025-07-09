import { createFileRoute } from '@tanstack/react-router'
import PatientMedicalHistoryTable from '@/components/patient/PatientMedicalHistoryTable'

export const Route = createFileRoute('/patient/medical-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PatientMedicalHistoryTable />
      {/* <PatientAppointmentTable /> */}
    </div>
  )
}
