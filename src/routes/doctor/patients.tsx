import { createFileRoute } from '@tanstack/react-router'
import PatientsTable from '@/components/patient/PatientsTable'

export const Route = createFileRoute('/doctor/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PatientsTable />
    </div>
  )
}
