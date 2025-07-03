import api from './axios'
// import type { PaginatedUsersResponse } from '@/types/types'

export const getUsers = async () => {
  const response = await api.get('/users?limit=20&page=1')
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
