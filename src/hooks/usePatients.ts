import { useQuery } from '@tanstack/react-query'
import { getPatient, getPatients } from '@/apis/patientsApi'

export const usePatients = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })

  return { data, isLoading, error }
}

export const usePatient = (patientId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
  })

  return { data, isLoading, error }
}
