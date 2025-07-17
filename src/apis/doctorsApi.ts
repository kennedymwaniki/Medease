import api from './axios'
import type { Doctor, DoctorTimeSlot } from '@/types/types'
// import type { PaginatedUsersResponse } from '@/types/types'

export const getDoctors = async (): Promise<Array<Doctor>> => {
  const response = await api.get('/doctors')
  return response.data
}
export const getDoctor = async (doctorId: number): Promise<Doctor> => {
  const response = await api.get(`/doctors/${doctorId}`)
  return response.data
}
export const createDoctor = async (data: any) => {
  const response = await api.post('/doctors', data)
  return response.data
}

export const deleteDoctor = async (doctorId: number) => {
  const response = await api.delete(`/doctors/${doctorId}`)
  return response.data
}

export const getDoctorAvailableSlotTimes = async (
  doctorId: number,
  date: string,
): Promise<Array<DoctorTimeSlot>> => {
  const response = await api.get(`/doctors/${doctorId}/available-slots/${date}`)
  return response.data
}
