import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Patient } from '@/types/types'
import { getPatient, getPatients, updatePatient } from '@/apis/patientsApi'

export const usePatients = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  })

  return { data, isLoading, error }
}

export const usePatient = (patientId: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
  })

  return { data, isLoading, error, refetch }
}

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, error } = useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: number
      data: Partial<Patient>
    }) => updatePatient(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] })
    },
    onError: () => {
      toast.error('Error updating patient profile')
    },
  })

  return { isPending, mutate, error }
}
