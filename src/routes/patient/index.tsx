import { createFileRoute } from '@tanstack/react-router'
import PatientStatCard from '@/components/patient/PatientStatCards'
import PatientPrescriptions from '@/components/patient/PatientPrescriptions'

export const Route = createFileRoute('/patient/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <p>This is your patient dashboard</p>
      <PatientStatCard />
      <PatientPrescriptions />
    </div>
  )
}
