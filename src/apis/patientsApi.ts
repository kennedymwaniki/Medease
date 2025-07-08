// import type { Patient } from '@/types/types'
import api from './axios'
import type { Patient } from '@/types/types'

export const getPatients = async (): Promise<Array<Patient>> => {
  const response = await api.get('/patients')
  return response.data
}
export const getPatient = async (
  patientId: number,
): Promise<Patient | null> => {
  const response = await api.get(`/patients/${patientId}`)
  if (response.status !== 200) {
    console.error('Failed to fetch patient data:', response)
    throw new Error('Failed to fetch patient data')
  }
  return response.data
}
export const createPatient = async (data: any) => {
  const response = await api.post('/patients', data)
  return response.data
}

export const deletePatient = async (patientId: number) => {
  const response = await api.delete(`/patients/${patientId}`)
  return response.data
}
