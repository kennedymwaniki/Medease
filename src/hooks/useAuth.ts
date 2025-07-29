import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  login,
  passwordResetConfirm,
  passwordResetRequest,
  registerUser,
} from '@/apis/authApi'
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
  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Registration successful:', data)
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`)
    },
  })
  return { mutate, isPending }
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

export const usePasswordResetRequest = () => {
  const {
    mutateAsync: passwordResetMutation,
    isPending,
    error: resetError,
  } = useMutation({
    mutationFn: (email: string) => passwordResetRequest(email),
    onSuccess: () => {
      toast.success('Password reset request sent successfully')
    },
    onError: (error) => {
      toast.error(`Password reset request failed: ${error.message}`)
    },
  })

  return { passwordResetMutation, isPending, resetError }
}

export const usePasswordResetConfirm = () => {
  const {
    mutateAsync: passwordResetConfirmMutation,
    isPending,
    error: confirmError,
  } = useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string
      otp: string
      newPassword: string
    }) => passwordResetConfirm(email, otp, newPassword),
    onSuccess: () => {
      toast.success('Password reset confirmed successfully')
    },
    onError: (error) => {
      toast.error(`Password reset confirmation failed: ${error.message}`)
    },
  })

  return { passwordResetConfirmMutation, isPending, confirmError }
}
