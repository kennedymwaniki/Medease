import api from './axios'
import type { CreatePrescriptionDto, Prescription } from '@/types/types'

export const getPrescriptions = async (): Promise<Array<Prescription>> => {
  const response = await api.get('/prescriptions')
  return response.data
}

export const getPrescription = async (
  patientId: number,
): Promise<Prescription> => {
  const response = await api.get(`/prescriptions/${patientId}`)
  return response.data
}

export const createPrescription = async (
  data: CreatePrescriptionDto,
): Promise<Prescription> => {
  const response = await api.post('/prescriptions', data)
  return response.data
}

export const deletePrescription = async (
  prescriptionId: number,
): Promise<void> => {
  const response = await api.delete(`/prescriptions/${prescriptionId}`)
  return response.data
}
