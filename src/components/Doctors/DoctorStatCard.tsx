import React from 'react'
import { Activity, Calendar, Clock, Users } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { useDoctor } from '@/hooks/useDoctors'

interface StatCardData {
  icon: React.ReactNode
  title: string
  number: string
  subtitle: string
  bgColor: string
  iconColor: string
}

const DoctorStatCard: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const doctorId = user?.doctor?.id
  const { data: doctorData, isLoading, error } = useDoctor(doctorId!)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading doctor data</div>

  const totalAppointments = doctorData?.appointments.length || 0
  const confirmedAppointments =
    doctorData?.appointments.filter((apt) => apt.status === 'confirmed')
      .length || 0
  const pendingAppointments =
    doctorData?.appointments.filter((apt) => apt.status === 'pending').length ||
    0

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments =
    doctorData?.appointments.filter((apt) => apt.date === today).length || 0

  const statData: Array<StatCardData> = [
    {
      icon: <Calendar size={24} />,
      title: 'Total Appointments',
      number: totalAppointments.toString(),
      subtitle: `${confirmedAppointments} confirmed`,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Clock size={24} />,
      title: 'Pending Appointments',
      number: pendingAppointments.toString(),
      subtitle: 'Awaiting confirmation',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      icon: <Users size={24} />,
      title: "Today's Appointments",
      number: todayAppointments.toString(),
      subtitle: 'Scheduled for today',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: <Activity size={24} />,
      title: 'Experience',
      number: `${doctorData?.experience || 0}`,
      subtitle: 'Years in practice',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="flex gap-4 p-2">
      {statData.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 min-w-0 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.number}</p>
              <p className={`text-xs ${stat.iconColor}`}>{stat.subtitle}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
              <div className={stat.iconColor}>{stat.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorStatCard
