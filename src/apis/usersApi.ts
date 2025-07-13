import api from './axios'
import type { UpdateUserDto } from '@/types/types'
// import type { PaginatedUsersResponse } from '@/types/types'

export const getUsers = async () => {
  const response = await api.get('/users')
  return response.data
}
export const getUser = async (userId: number) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}
export const createUser = async (data: any) => {
  const response = await api.post('/users', data)
  return response.data
}

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}

export const updateUser = async (userId: number, data: UpdateUserDto) => {
  const response = await api.patch(`/users/${userId}`, data)
  return response.data
}
