import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UpdateUserDto } from '@/types/types'
import { deleteUser, getUser, getUsers, updateUser } from '@/apis/usersApi'

export const useUsers = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: getUsers,
  })

  return { data, isLoading, error, refetch }
}

export const useUser = (userId: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  })

  return { data, isLoading, error, refetch }
}
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const {
    isPending,
    error,
    mutate: removeUser,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully', {
        position: 'top-right',
      })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      toast.error(`Error deleting user`)
    },
  })
  return {
    isPending,
    error,
    removeUser,
  }
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const {
    isPending,
    error,
    mutate: updateUserProfile,
  } = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserDto }) =>
      updateUser(userId, data),
    onSuccess: () => {
      toast.success('User updated successfully', {
        position: 'top-right',
      })
      queryClient.invalidateQueries({ queryKey: ['user', 'patient'] })

      // Invalidate all patient queries
      queryClient.invalidateQueries({ queryKey: ['patient'] })
    },
    onError: () => {
      toast.error(`Error updating user`)
    },
  })
  return {
    isPending,
    error,
    updateUserProfile,
  }
}
