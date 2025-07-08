import api from './axios'
import type { Appointment, CreateAppointmentDto } from '@/types/types'
// import type { PaginatedUsersResponse } from '@/types/types'

export const getAppointments = async (): Promise<Array<Appointment>> => {
  const response = await api.get('appointments')
  return response.data
}
export const getAppointment = async (appointmentId: number) => {
  const response = await api.get(`/appointments/${appointmentId}`)
  return response.data
}
export const createAppointment = async (data: CreateAppointmentDto) => {
  const response = await api.post('/appointments', data)
  return response.data
}

export const updateAppointment = async (appointmentId: number, data: any) => {
  const response = await api.put(`/appointments/${appointmentId}`, data)
  return response.data
}

export const deleteAppointment = async (appointmentId: number) => {
  const response = await api.delete(`/appointments/${appointmentId}`)
  return response.data
}
