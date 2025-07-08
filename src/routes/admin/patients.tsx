import { createFileRoute } from '@tanstack/react-router'
import { usePatients } from '@/hooks/usePatients'

export const Route = createFileRoute('/admin/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = usePatients()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div>
      <h1>Your Patients</h1>
      <ul>
        {data?.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  )
}
