import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateDoctorDto } from './../types/types'
import {
  createDoctor,
  getDoctor,
  getDoctorAvailableSlotTimes,
  getDoctors,
} from '@/apis/doctorsApi'

export const useDoctors = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  })

  return { data, isLoading, error }
}

export const useDoctor = (doctorId: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => getDoctor(doctorId),
  })

  return { data, isLoading, error, refetch }
}

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: CreateDoctorDto) => createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctors'],
      })
    },
  })
  return { createDoctor: mutate, isPending, error }
}

export const useGetDoctorAvailableTimes = (doctorId: number, date: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['doctorAvailableTimes', doctorId, date],
    queryFn: () => getDoctorAvailableSlotTimes(doctorId, date),
    enabled: !!doctorId && !!date, // Only fetch if doctorId and date are provided
  })
  return { data, isLoading, error, refetch }
}
