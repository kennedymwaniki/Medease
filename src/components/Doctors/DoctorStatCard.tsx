import React from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
  Video,
} from 'lucide-react'
import { useDoctor } from '@/hooks/useDoctors'
import { useAuthStore } from '@/store/authStore'

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

const DoctorStatCard: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const doctorId = user?.doctor?.id
  const { data: doctorData, isLoading, error } = useDoctor(doctorId!)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-red-600 font-medium">
            Error loading doctor data
          </div>
          <div className="text-red-500 text-sm mt-1">{error.message}</div>
        </div>
      </motion.div>
    )
  }

  // Calculate appointment metrics
  const totalAppointments = doctorData?.appointments.length ?? 0
  const confirmedAppointments =
    doctorData?.appointments.filter((apt) => apt.status === 'confirmed')
      .length ?? 0
  const pendingAppointments =
    doctorData?.appointments.filter((apt) => apt.status === 'pending').length ??
    0

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments =
    doctorData?.appointments.filter((apt) => apt.date === today).length ?? 0

  // Get upcoming appointments (today and future)
  const upcomingAppointments =
    doctorData?.appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      return (
        aptDate >= currentDate &&
        (apt.status === 'confirmed' || apt.status === 'pending')
      )
    }).length ?? 0

  // Get unique patients count
  const uniquePatients = new Set(
    doctorData?.appointments.map((apt) => apt.patient.id),
  ).size

  // Get appointments with video links
  const videoAppointments =
    doctorData?.appointments.filter((apt) => apt.zoomMeetingId && apt.user_url)
      .length ?? 0

  // Get total prescriptions issued
  const totalPrescriptions = doctorData?.prescriptions.length ?? 0

  const statData: Array<StatCardData> = [
    {
      icon: <Calendar size={24} />,
      title: 'Total Appointments',
      number: totalAppointments.toString(),
      subtitle: `${confirmedAppointments} confirmed, ${pendingAppointments} pending`,
      trend: {
        value:
          confirmedAppointments > 0
            ? `${Math.round((confirmedAppointments / totalAppointments) * 100)}% confirmed`
            : 'No appointments',
        isPositive: confirmedAppointments > 0,
      },
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconGradient: 'from-blue-400 to-indigo-400',
      shadowColor: 'shadow-blue-500/25',
    },
    {
      icon: <Clock size={24} />,
      title: 'Upcoming Appointments',
      number: upcomingAppointments.toString(),
      subtitle: `${todayAppointments} scheduled for today`,
      trend: {
        value: todayAppointments > 0 ? 'Busy day ahead' : 'Light schedule',
        isPositive: todayAppointments > 0,
      },
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      iconGradient: 'from-emerald-300 to-teal-300',
      shadowColor: 'shadow-emerald-500/25',
    },
    {
      icon: <Users size={24} />,
      title: 'Unique Patients',
      number: uniquePatients.toString(),
      subtitle: 'Individual patients served',
      trend: {
        value: uniquePatients > 0 ? 'Growing practice' : 'New practice',
        isPositive: uniquePatients > 0,
      },
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      iconGradient: 'from-purple-400 to-violet-400',
      shadowColor: 'shadow-purple-500/25',
    },
    {
      icon: <Video size={24} />,
      title: 'Video Consultations',
      number: videoAppointments.toString(),
      subtitle: 'Virtual appointments setup',
      trend: {
        value:
          totalAppointments > 0
            ? `${Math.round((videoAppointments / totalAppointments) * 100)}% virtual`
            : 'No virtual appointments',
        isPositive: videoAppointments > 0,
      },
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      iconGradient: 'from-orange-300 to-red-300',
      shadowColor: 'shadow-orange-500/25',
    },
    {
      icon: <FileText size={24} />,
      title: 'Prescriptions Issued',
      number: totalPrescriptions.toString(),
      subtitle: 'Medications prescribed',
      trend: {
        value:
          totalPrescriptions > 0 ? 'Active prescriber' : 'No prescriptions',
        isPositive: totalPrescriptions > 0,
      },
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      iconGradient: 'from-slate-400 to-slate-500',
      shadowColor: 'shadow-slate-500/25',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen"
    >
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Doctor Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your practice and patient interactions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadowColor} hover:shadow-2xl transition-all duration-500`}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [-10, 0, -10],
                  y: [-10, 0, -10],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              ></motion.div>
              <motion.div
                className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [8, 0, 8],
                  y: [8, 0, 8],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2,
                }}
              ></motion.div>
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
          </motion.div>
        ))}
      </div>

      {/* Doctor Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Doctor Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Doctor Avatar */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={doctorData?.user.imagelink || '/default-avatar.png'}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${doctorData?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
            </motion.div>

            {/* Doctor Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                Dr. {doctorData?.user.firstname} {doctorData?.user.lastname}
              </h3>
              <p className="text-gray-600">{doctorData?.specialization}</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Experience</div>
                  <div className="text-lg font-semibold">
                    {doctorData?.experience} years
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="text-lg font-semibold flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${doctorData?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                    ></div>
                    {doctorData?.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Appointment Status</span>
              <span>{totalAppointments} total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              {totalAppointments > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(confirmedAppointments / totalAppointments) * 100}%`,
                  }}
                  transition={{ duration: 1 }}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-2"
                ></motion.div>
              )}
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">
                  Confirmed: {confirmedAppointments}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">
                  Pending: {pendingAppointments}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Today's Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600 mt-2">
                {todayAppointments}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Confirmed</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {confirmedAppointments}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 mt-2">
                {pendingAppointments}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Prescriptions</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 mt-2">
                {totalPrescriptions}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DoctorStatCard
