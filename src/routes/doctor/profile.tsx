import { createFileRoute } from '@tanstack/react-router'
import DoctorProfile from '@/components/Doctors/DoctorProfile'

export const Route = createFileRoute('/doctor/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DoctorProfile />
    </div>
  )
}
