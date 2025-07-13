import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
} from '@/apis/appointmentsApi'
// import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

export const useAppointments = () => {
  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  })

  return { appointments, isLoading, error }
}

export const useAppointment = (appointmentId: number) => {
  const {
    data: appointment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointment(appointmentId),
  })

  return { appointment, isLoading, error }
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  const {
    mutate: newAppointment,
    isPending,
    error,
  } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      })
      queryClient.invalidateQueries({
        queryKey: ['patient'],
      })
    },
  })

  return { createAppointment: newAppointment, isPending, error }
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()
  const {
    mutate: removeAppointment,
    isPending,
    error,
  } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      })
    },
  })

  return { removeAppointment, isPending, error }
}

export const useUpdateAppointment = (appointmentId: number) => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: any) => updateAppointment(appointmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      })
    },
  })
  return { updateAppointment: mutate, isPending, error }
}
