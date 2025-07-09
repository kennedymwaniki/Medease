import api from './axios'

export const login = async (data: any) => {
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
