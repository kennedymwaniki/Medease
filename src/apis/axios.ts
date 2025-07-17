import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import type { UserRole } from '@/types/types'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export type JWTPayload = {
  sub: number
  email: string
  role: UserRole
  iat: number
  exp: number
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

const getNewAccessToken = async (): Promise<string | null> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = performTokenRefresh()

  try {
    const result = await refreshPromise
    return result
  } finally {
    isRefreshing = false
    refreshPromise = null
  }
}

const performTokenRefresh = async (): Promise<string | null> => {
  const { user, refreshToken } = useAuthStore.getState()

  if (!user?.id || !refreshToken) {
    console.error('Missing user ID or refresh token')
    // Clear user state and redirect to login
    useAuthStore.getState().clearUser()
    window.location.href = '/login'
    return null
  }

  try {
    const response = await fetch(
      `http://localhost:8000/auth/refresh?id=${user.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const { accessToken, refreshToken: newRefreshToken } = data

    if (!accessToken || !newRefreshToken) {
      throw new Error('Invalid response: missing tokens')
    }

    // Update the auth store with new tokens
    useAuthStore.setState({
      accessToken,
      refreshToken: newRefreshToken,
    })

    console.log('Token refreshed successfully')
    return accessToken
  } catch (error) {
    console.error('Failed to refresh access token:', error)

    useAuthStore.getState().clearUser()
    window.location.href = '/login'

    return null
  }
}

export const getValidToken = async (): Promise<string | null> => {
  let accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    console.log('No access token available')
    return null
  }

  try {
    const decoded = jwtDecode<JWTPayload>(accessToken)
    const currentTime = Math.floor(Date.now() / 1000)
    const bufferTime = 30

    if (decoded.exp <= currentTime + bufferTime) {
      console.log('Token expired or expiring soon, refreshing...')
      accessToken = await getNewAccessToken()
      console.log('This is the new access token:', accessToken)

      return accessToken
    }

    return accessToken
  } catch (error) {
    console.error('Error decoding token:', error)

    accessToken = await getNewAccessToken()
    console.log('This is the new access token:', accessToken)
    return accessToken
  }
}

api.interceptors.request.use(
  async (config) => {
    const accessToken = await getValidToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccessToken = await getNewAccessToken()

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } else {
          useAuthStore.getState().clearUser()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        useAuthStore.getState().clearUser()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
