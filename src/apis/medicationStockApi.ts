import api from './axios'

export const getMedicationStock = async () => {
  const response = await api.get('/medication-stock')
  return response.data
}

export const createMedicationStock = async (data: any) => {
  const response = await api.post('/medication-stock', data)
  return response.data
}

export const deleteMedicationStock = async (medicationStockId: number) => {
  const response = await api.delete(`/medication-stock/${medicationStockId}`)
  return response.data
}
