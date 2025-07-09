import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { login, registerUser } from '@/apis/authApi'
import { authctions } from '@/store/authStore'
// import { register } from 'node:module'

export const useLogin = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authctions.setUser(data)
      console.log('Login successful:', data)
      navigate({ to: '/admin' })
    },
    onError: (error) => {
      // Handle login error, e.g., show an error message
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
    onError: () => {
      // Handle registration error, e.g., show an error message
      console.error('Registration failed', error)
    },
  })
  return { mutate, isPending, error }
}
