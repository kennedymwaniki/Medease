import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateDoctorDto } from './../types/types'
import { createDoctor, getDoctor, getDoctors } from '@/apis/doctorsApi'

export const useDoctors = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  })

  return { data, isLoading, error }
}

export const useDoctor = (doctorId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => getDoctor(doctorId),
  })

  return { data, isLoading, error }
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
