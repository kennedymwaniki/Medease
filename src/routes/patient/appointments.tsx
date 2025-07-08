import { createFileRoute } from '@tanstack/react-router'
import PatientAppointments from '@/components/patient/PatientAppointments'

export const Route = createFileRoute('/patient/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Your Appointments</h1>
      <PatientAppointments />
    </div>
  )
}
