import { createFileRoute } from '@tanstack/react-router'
import DoctorStatCard from '@/components/Doctors/DoctorStatCard'
import DoctorAppointmentList from '@/components/Doctors/DoctorAppointmentList'

export const Route = createFileRoute('/doctor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DoctorStatCard />
      <DoctorAppointmentList />
    </div>
  )
}
