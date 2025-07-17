import { createFileRoute } from '@tanstack/react-router'
import DoctorAppointmentsTable from '@/components/Doctors/DoctorAppointmentsTable'

export const Route = createFileRoute('/doctor/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DoctorAppointmentsTable />
      {/* <DoctorAppointmentForm /> */}
    </div>
  )
}
