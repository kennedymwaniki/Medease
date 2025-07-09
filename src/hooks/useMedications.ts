// import { useDeleteMedication } from '@/hooks/useMedications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createMedication,
  deleteMedication,
  getMedications,
  updateMedication,
} from '@/apis/medicationsApi'

export const useMedications = () => {
  const {
    data: medications,
    // isLoading,
    isPending,
    error,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: () => getMedications(),
  })

  return {
    medications,
    // isLoading,
    isPending,
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

export const useCreateMedication = () => {
  const queryClient = useQueryClient()
  const {
    mutate: addMedication,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ['medications'],
    mutationFn: createMedication,
    onSuccess: () => {
      toast.success('Medication created successfully!')
      queryClient.invalidateQueries({
        queryKey: ['medications'],
      })
    },

    onError: () => {
      toast.error('Failed to create medication. Please try again.')
      console.error('Error creating medication:', error)
    },
  })
  return { addMedication, isPending, isError, error }
}
