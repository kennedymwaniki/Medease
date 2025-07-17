import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { login, registerUser } from '@/apis/authApi'
import { useAuthStore } from '@/store/authStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data)
      if (data.user.role === 'admin') {
        navigate({ to: '/admin' })
      } else if (data.user.role === 'patient') {
        navigate({ to: '/patient' })
      } else if (data.user.role === 'doctor') {
        navigate({ to: '/doctor' })
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
  return { mutate, isPending }
}

export const useRegister = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Registration successful:', data)
    },
    onError: (error) => {
      console.error('Registration failed', error)
    },
  })
  return { mutate, isPending, error }
}

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser)
  const navigate = useNavigate()

  const logout = () => {
    clearUser()
    navigate({ to: '/login' })
  }

  return logout
}
