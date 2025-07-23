import { useMutation, useQueryClient } from '@tanstack/react-query'
import { payStackPush } from '@/apis/paymentsApi'

export const usePaymentsPaystack = () => {
  const queryClient = useQueryClient()
  const {
    mutate: payStackPayment,
    isPending,
    isError,
    mutateAsync: payStackPaymentAsync,
    error,
  } = useMutation({
    mutationKey: ['paystack'],
    mutationFn: payStackPush,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['payments', 'patient'],
      })
    },
  })
  return {
    payStackPaymentAsync,
    payStackPayment,
    isPending,
    isError,
    paymentError: error,
  }
}
