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

export const passwordResetRequest = async (email: string) => {
  const request = await api.post('/auth/password-reset-request', { email })
  return request.data
}

export const passwordResetConfirm = async (
  email: string,
  otp: string,
  password: string,
) => {
  const request = await api.post('/auth/password-reset', {
    email,
    otp,
    password,
  })
  return request.data
}
