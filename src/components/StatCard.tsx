import React from 'react'
import { Calendar, Pill, Bell, Activity } from 'lucide-react'

interface StatCardData {
  icon: React.ReactNode
  title: string
  number: string
  subtitle: string
  bgColor: string
  iconColor: string
}

const StatCard: React.FC = () => {
  const statData: StatCardData[] = [
    {
      icon: <Calendar size={24} />,
      title: 'Next Appointment',
      number: '2 Days',
      subtitle: 'Dr. Smith - Cardiology',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Pill size={24} />,
      title: 'Active Prescriptions',
      number: '4',
      subtitle: 'All up to date',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: <Bell size={24} />,
      title: 'Medication Reminders',
      number: '3',
      subtitle: 'Due today',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: <Activity size={24} />,
      title: 'Health Score',
      number: '85%',
      subtitle: 'Good health',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ]

  return (
    <div className="flex gap-4 p-4">
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

export default StatCard
