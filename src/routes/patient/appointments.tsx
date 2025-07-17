import { createFileRoute } from '@tanstack/react-router'
// import PatientAppointments from '@/components/patient/PatientAppointments'
import PatientAppointmentTable from '@/components/patient/PatientAppointmentTable'

export const Route = createFileRoute('/patient/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <PatientAppointmentTable />
    </div>
  )
}
