import { usePatient } from '@/hooks/usePatients'

const PatientAppointments = () => {
  const patientId = 1

  const { data: user, isLoading, error } = usePatient(patientId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  console.info('Patient Data:', user)
  return (
    <div>
      PatientAppointments
      <h1>Your Appointments</h1>
      <ul>
        <li key={user?.id}>{user?.name}</li>
      </ul>
    </div>
  )
}

export default PatientAppointments
