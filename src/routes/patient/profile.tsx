import { createFileRoute } from '@tanstack/react-router'
import PatientProfile from '@/components/patient/PatientProfile'

export const Route = createFileRoute('/patient/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PatientProfile />
    </div>
  )
}
