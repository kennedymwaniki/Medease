// import { useDeleteMedication } from '@/hooks/useMedications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteMedication,
  getMedications,
  updateMedication,
} from '@/apis/medicationsApi'

export const useMedications = () => {
  const {
    data: medications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: () => getMedications(),
  })

  return {
    medications,
    isLoading,
    isError,
    error,
  }
}

export const useUpdateMedication = (medicationId: number, data: any) => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ['medications', medicationId],
    mutationFn: () => updateMedication(medicationId, data),
  })

  return { mutate, isPending, isError, error }
}

export const useDeleteMedication = () => {
  const queryClient = useQueryClient()
  const {
    mutate: removeMedication,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ['medications'],
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medications'],
      })
    },
  })

  return { removeMedication, isPending, isError, error }
}
