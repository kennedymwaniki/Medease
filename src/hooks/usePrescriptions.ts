import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  deletePrescription,
  getPrescription,
  getPrescriptions,
} from '@/apis/prescriptionsApi'

export const usePrescriptions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => getPrescriptions(),
  })
  return {
    prescriptions: data,
    isLoading,
    isError,
    error,
  }
}

export const usePrescription = (prescriptionId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prescription', prescriptionId],
    queryFn: () => getPrescription(prescriptionId),
  })

  return {
    prescription: data,
    isLoading,
    error,
  }
}

export const useDeletePrescription = () => {
  const queryClient = useQueryClient()
  const {
    isPending,
    error,
    mutate: removePrescription,
  } = useMutation({
    mutationFn: deletePrescription,
    onSuccess: () => {
      toast.success('Prescription deleted successfully', {
        position: 'top-right',
      })
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
    onError: () => {
      toast.error(`Error deleting prescription`)
    },
  })
  return {
    isPending,
    error,
    removePrescription,
  }
}
