import api from './axios'

export const getMedicalHistory = async (patientId: number) => {
  const response = await api.get(`/medical-history/${patientId}`)
  return response.data
}
export const createMedicalHistory = async (data: any) => {
  const response = await api.post('/medical-history', data)
  return response.data
}

export const deleteMedicalHistory = async (medicalHistoryId: number) => {
  const response = await api.delete(`/medical-history/${medicalHistoryId}`)
  return response.data
}
