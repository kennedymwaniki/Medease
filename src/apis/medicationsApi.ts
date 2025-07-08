import api from './axios'
import type { Medication } from '@/types/types'
// import type { PaginatedUsersResponse } from '@/types/types'

export const getMedications = async (): Promise<Array<Medication>> => {
  const response = await api.get('/medications')
  return response.data
}
export const getMedication = async (
  medicationId: number,
): Promise<Medication> => {
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

export const updateMedication = async (
  medicationId: number,
  data: any,
): Promise<Medication> => {
  const response = await api.patch(`/medications/${medicationId}`, data)
  return response.data
}
