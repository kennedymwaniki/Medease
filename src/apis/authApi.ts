import api from './axios'
import type { AuthResponse, LoginDto } from '@/types/types'

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerUser = async (data: any) => {
  const response = await api.post('/users', data)
  return response.data
}
export const logout = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}
