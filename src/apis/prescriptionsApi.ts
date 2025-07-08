import api from './axios'
export const getPrescriptions = async (patientId: number) => {
  const response = await api.get(`/prescriptions/${patientId}`)
  return response.data
}

export const createPrescription = async (data: any) => {
  const response = await api.post('/prescriptions', data)
  return response.data
}

export const deletePrescription = async (prescriptionId: number) => {
  const response = await api.delete(`/prescriptions/${prescriptionId}`)
  return response.data
}
