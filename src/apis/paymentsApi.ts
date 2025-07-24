import api from './axios'
import type { PaystackPushResponse } from '@/types/types'

export const payStackPush = async (data: {
  email: string
  amount: number
  prescriptionId: number
}): Promise<PaystackPushResponse> => {
  const response = await api.post('/payments/paystack-push', data)
  console.log('This is from the pastackpush api', response.data)
  return response.data
}
