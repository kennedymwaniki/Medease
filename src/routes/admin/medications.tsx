import { createFileRoute } from '@tanstack/react-router'
import MedicationsTable from '@/components/MedicationsTable'

export const Route = createFileRoute('/admin/medications')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <MedicationsTable />
    </div>
  )
}
