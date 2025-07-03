import api from './axios'

export const getPatients = async () => {
  const response = await api.get('/patients?limit=20&page=1')
  return response.data
}
export const getPatient = async (patientId: number) => {
  const response = await api.get(`/patients/${patientId}`)
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
