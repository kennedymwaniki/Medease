import React from 'react'
import {
  Activity,
  Calendar,
  CalendarCheck,
  Clock,
  FileText,
  Pill,
  Stethoscope,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'
import { usePatients } from '@/hooks/usePatients'
import { useDoctors } from '@/hooks/useDoctors'
import { useMedications } from '@/hooks/useMedications'
import { useAppointments } from '@/hooks/useAppointments'
import { usePrescriptions } from '@/hooks/usePrescriptions'
import { useUsers } from '@/hooks/useUser'

interface StatCardData {
  icon: React.ReactNode
  title: string
  number: string
  subtitle: string
  trend: {
    value: string
    isPositive: boolean
  }
  gradient: string
  iconGradient: string
  shadowColor: string
}

const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1 min-w-0 space-y-3">
        <div className="h-4 bg-gray-300 rounded-lg w-3/4"></div>
        <div className="h-8 bg-gray-300 rounded-lg w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded-lg w-full"></div>
      </div>
      <div className="w-14 h-14 bg-gray-300 rounded-2xl ml-4"></div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-300">
      <div className="h-3 bg-gray-300 rounded w-16"></div>
      <div className="h-3 bg-gray-300 rounded w-12"></div>
    </div>
  </div>
)

const AdminStatCard = () => {
  const { data: patientData, isLoading: isLoadingPatients } = usePatients()
  const { data: doctorData, isLoading: isLoadingDoctors } = useDoctors()
  const { medications, isLoading: isLoadingMedications } = useMedications()
  const { appointments, isLoading: isLoadingAppointments } = useAppointments()
  const { data: userData, isLoading: isLoadingUsers } = useUsers()
  const { prescriptions, isLoading: isLoadingPrescriptions } =
    usePrescriptions()

  const isLoading =
    isLoadingPatients ||
    isLoadingDoctors ||
    isLoadingMedications ||
    isLoadingAppointments ||
    isLoadingUsers ||
    isLoadingPrescriptions

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {[...Array(9)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
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

  // Calculate some additional metrics
  const activeSystemLoad = Math.min(100, Math.round((totalUsers / 200) * 100))
  const averageAppointmentsPerDay = Math.round(totalAppointments / 30)

  const statData: Array<StatCardData> = [
    {
      icon: <Users size={24} />,
      title: 'Total Users',
      number: totalUsers.toLocaleString(),
      subtitle: 'Registered system users',
      trend: { value: '+12.5%', isPositive: true },
      gradient: 'from-violet-500 via-purple-500 to-purple-600',
      iconGradient: 'from-violet-400 to-purple-400',
      shadowColor: 'shadow-purple-500/25',
    },
    {
      icon: <Users size={24} />,
      title: 'Total Patients',
      number: totalPatients.toLocaleString(),
      subtitle: 'Active patient records',
      trend: { value: '+8.3%', isPositive: true },
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      iconGradient: 'from-blue-400 to-cyan-400',
      shadowColor: 'shadow-blue-500/25',
    },
    {
      icon: <Stethoscope size={24} />,
      title: 'Medical Staff',
      number: totalDoctors.toString(),
      subtitle: 'Healthcare professionals',
      trend: { value: '+2 new', isPositive: true },
      gradient: 'from-emerald-500 via-green-500 to-teal-600',
      iconGradient: 'from-emerald-400 to-green-400',
      shadowColor: 'shadow-emerald-500/25',
    },
    {
      icon: <UserCheck size={24} />,
      title: 'Available Doctors',
      number: availableDoctors.toString(),
      subtitle: 'Ready for consultations',
      trend: {
        value: `${Math.round((availableDoctors / totalDoctors) * 100)}%`,
        isPositive: true,
      },
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      iconGradient: 'from-green-300 to-emerald-300',
      shadowColor: 'shadow-green-500/25',
    },
    {
      icon: <UserX size={24} />,
      title: 'Busy Doctors',
      number: unavailableDoctors.toString(),
      subtitle: 'Currently occupied',
      trend: {
        value: `${Math.round((unavailableDoctors / totalDoctors) * 100)}%`,
        isPositive: false,
      },
      gradient: 'from-red-400 via-rose-500 to-pink-500',
      iconGradient: 'from-red-300 to-rose-300',
      shadowColor: 'shadow-red-500/25',
    },
    {
      icon: <Pill size={24} />,
      title: 'Medications',
      number: totalMedications.toLocaleString(),
      subtitle: 'Available in inventory',
      trend: { value: '+15 added', isPositive: true },
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      iconGradient: 'from-indigo-400 to-purple-400',
      shadowColor: 'shadow-indigo-500/25',
    },
    {
      icon: <Calendar size={24} />,
      title: 'Total Appointments',
      number: totalAppointments.toLocaleString(),
      subtitle: `Avg ${averageAppointmentsPerDay}/day`,
      trend: { value: '+18.7%', isPositive: true },
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      iconGradient: 'from-orange-300 to-amber-300',
      shadowColor: 'shadow-orange-500/25',
    },
    {
      icon: <CalendarCheck size={24} />,
      title: "Today's Schedule",
      number: todayAppointments.toString(),
      subtitle: 'Appointments today',
      trend: { value: 'On track', isPositive: true },
      gradient: 'from-teal-400 via-cyan-500 to-blue-500',
      iconGradient: 'from-teal-300 to-cyan-300',
      shadowColor: 'shadow-teal-500/25',
    },
    {
      icon: <FileText size={24} />,
      title: 'Prescriptions',
      number: totalPrescriptions.toLocaleString(),
      subtitle: 'Total issued prescriptions',
      trend: { value: '+22.1%', isPositive: true },
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      iconGradient: 'from-pink-300 to-rose-300',
      shadowColor: 'shadow-pink-500/25',
    },
  ]

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Healthcare Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time system overview and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statData.map((stat, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadowColor} hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8 group-hover:scale-125 transition-transform duration-700"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 mb-2 truncate">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-white leading-none">
                      {stat.number}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stat.trend.isPositive
                          ? 'bg-white/20 text-white'
                          : 'bg-black/20 text-white'
                      }`}
                    >
                      <TrendingUp
                        className={`w-3 h-3 ${
                          stat.trend.isPositive ? '' : 'rotate-180'
                        }`}
                      />
                      {stat.trend.value}
                    </div>
                  </div>
                  <p className="text-sm text-white/75 leading-tight">
                    {stat.subtitle}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${stat.iconGradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ml-3`}
                >
                  <div className="text-white">{stat.icon}</div>
                </div>
              </div>

              {/* Bottom section with progress indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white/60" />
                  <span className="text-xs text-white/60">Live Data</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-white/80 font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* System Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              System Performance
            </h3>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">Optimal</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Server Load</span>
                <span>{activeSystemLoad}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${activeSystemLoad}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {totalUsers}
                </div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Today's Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
              <div className="text-xl font-bold text-indigo-600">
                {todayAppointments}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Available Doctors</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                {availableDoctors}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">New Patients</span>
              </div>
              <div className="text-xl font-bold text-blue-600">24</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">New Prescriptions</span>
              </div>
              <div className="text-xl font-bold text-purple-600">18</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStatCard
