import { createFileRoute } from '@tanstack/react-router'
import MedicationsTable from '@/components/MedicationsTable'
import MedicationForm from '@/components/patient/forms/MedicationForm'

export const Route = createFileRoute('/admin/medications')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <MedicationsTable />
      <MedicationForm />
    </div>
  )
}
