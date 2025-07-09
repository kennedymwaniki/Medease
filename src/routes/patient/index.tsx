import { createFileRoute } from '@tanstack/react-router'
import PatientStatCard from '@/components/patient/PatientStatCards'

export const Route = createFileRoute('/patient/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <p>This is your patient dashboard</p>
      <PatientStatCard />
    </div>
  )
}
