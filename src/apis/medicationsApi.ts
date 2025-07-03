import api from './axios'
// import type { PaginatedUsersResponse } from '@/types/types'

export const getMedications = async () => {
  const response = await api.get('/medications?limit=20&page=1')
  return response.data
}
export const getMedication = async (medicationId: number) => {
  const response = await api.get(`/medications/${medicationId}`)
  return response.data
}
export const createMedication = async (data: any) => {
  const response = await api.post('/medications', data)
  return response.data
}

export const deleteMedication = async (medicationId: number) => {
  const response = await api.delete(`/medications/${medicationId}`)
  return response.data
}
