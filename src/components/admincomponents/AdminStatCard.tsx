import React from 'react'
import {
  Calendar,
  CalendarCheck,
  FileText,
  Pill,
  Stethoscope,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'
import { useAppointments } from '@/hooks/useAppointments'
import { useDoctors } from '@/hooks/useDoctors'
import { useMedications } from '@/hooks/useMedications'
import { usePatients } from '@/hooks/usePatients'
import { usePrescriptions } from '@/hooks/usePrescriptions'
import { useUsers } from '@/hooks/useUser'

interface StatCardData {
  icon: React.ReactNode
  title: string
  number: string
  subtitle: string
  bgColor: string
  iconColor: string
}

const AdminStatCard = () => {
  const { data: patientData, isLoading: isLoadingPatients } = usePatients()
  const { data: doctorData, isLoading: isLoadingDoctors } = useDoctors()
  const { medications, isLoading: isLoadingMedications } = useMedications()
  const { appointments, isLoading: isLoadingAppointments } = useAppointments()
  const { data: userData, isLoading: isLoadingUsers } = useUsers()
  const { prescriptions, isLoading: isLoadingPrescriptions } =
    usePrescriptions()

  if (
    isLoadingPatients ||
    isLoadingDoctors ||
    isLoadingMedications ||
    isLoadingAppointments ||
    isLoadingUsers ||
    isLoadingPrescriptions
  ) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const totalPatients = patientData?.length || 0
  const totalDoctors = doctorData?.length || 0
  const totalMedications = medications?.length || 0
  const totalAppointments = appointments?.length || 0
  const totalPrescriptions = prescriptions?.length || 0
  const totalUsers = userData?.length || 0

  const availableDoctors =
    doctorData?.filter((doctor) => doctor.isAvailable).length || 0
  const unavailableDoctors =
    doctorData?.filter((doctor) => !doctor.isAvailable).length || 0

  // Today's appointments
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments =
    appointments?.filter((apt) => apt.date === today).length || 0

  const statData: Array<StatCardData> = [
    {
      icon: <Users size={24} />,
      title: 'Total Users',
      number: totalUsers.toString(),
      subtitle: 'Registered users',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
    },
    {
      icon: <Users size={24} />,
      title: 'Total Patients',
      number: totalPatients.toString(),
      subtitle: 'Registered patients',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Stethoscope size={24} />,
      title: 'Total Doctors',
      number: totalDoctors.toString(),
      subtitle: 'Medical professionals',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      icon: <UserCheck size={24} />,
      title: 'Available Doctors',
      number: availableDoctors.toString(),
      subtitle: 'Currently available',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: <UserX size={24} />,
      title: 'Unavailable Doctors',
      number: unavailableDoctors.toString(),
      subtitle: 'Currently busy',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      icon: <Pill size={24} />,
      title: 'Total Medications',
      number: totalMedications.toString(),
      subtitle: 'In inventory',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: <Calendar size={24} />,
      title: 'Total Appointments',
      number: totalAppointments.toString(),
      subtitle: 'All appointments',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: <CalendarCheck size={24} />,
      title: "Today's Appointments",
      number: todayAppointments.toString(),
      subtitle: 'Scheduled for today',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: <FileText size={24} />,
      title: 'Total Prescriptions',
      number: totalPrescriptions.toString(),
      subtitle: 'All prescriptions',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
      {statData.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.number}</p>
              <p className={`text-xs ${stat.iconColor} truncate`}>
                {stat.subtitle}
              </p>
            </div>
            <div
              className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0 ml-2`}
            >
              <div className={stat.iconColor}>{stat.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminStatCard
