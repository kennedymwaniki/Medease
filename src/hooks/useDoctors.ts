import { useQuery } from '@tanstack/react-query'
import { getDoctor, getDoctors } from '@/apis/doctorsApi'

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
