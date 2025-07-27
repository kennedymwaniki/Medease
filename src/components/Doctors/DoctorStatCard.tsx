/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'
import React from 'react'
import { useDoctor } from '@/hooks/useDoctors'
import { useAuthStore } from '@/store/authStore'

interface StatCardData {
  icon: React.ReactNode
  title: string
  number: string
  subtitle: string
  gradient: string
  iconBg: string
  iconColor: string
  textColor: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

const DoctorStatCard: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const doctorId = user?.doctor?.id
  const { data: doctorData, isLoading, error } = useDoctor(doctorId!)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-red-600 font-medium">
            Error loading doctor data
          </div>
          <div className="text-red-500 text-sm mt-1">{error.message}</div>
        </div>
      </div>
    )
  }

  // Calculate appointment metrics
  const totalAppointments = doctorData?.appointments?.length ?? 0
  const confirmedAppointments =
    doctorData?.appointments?.filter((apt) => apt.status === 'confirmed')
      ?.length ?? 0
  const pendingAppointments =
    doctorData?.appointments?.filter((apt) => apt.status === 'pending')
      ?.length ?? 0

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments =
    doctorData?.appointments?.filter((apt) => apt.date === today)?.length ?? 0

  // Get upcoming appointments (today and future)
  const upcomingAppointments =
    doctorData?.appointments?.filter((apt) => {
      const aptDate = new Date(apt.date)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      return (
        aptDate >= currentDate &&
        (apt.status === 'confirmed' || apt.status === 'pending')
      )
    })?.length ?? 0

  // Get unique patients count
  const uniquePatients = new Set(
    doctorData?.appointments?.map((apt) => apt.patient.id),
  ).size

  // Get appointments with video links
  const videoAppointments =
    doctorData?.appointments?.filter((apt) => apt.zoomMeetingId && apt.user_url)
      ?.length ?? 0

  // Get total prescriptions issued
  const totalPrescriptions = doctorData?.prescriptions?.length ?? 0

  const statData: Array<StatCardData> = [
    {
      icon: <Calendar size={22} />,
      title: 'Total Appointments',
      number: totalAppointments.toString(),
      subtitle: `${confirmedAppointments} confirmed, ${pendingAppointments} pending`,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      trend: {
        value:
          confirmedAppointments > 0
            ? `${Math.round((confirmedAppointments / totalAppointments) * 100)}% confirmed`
            : 'No appointments',
        isPositive: confirmedAppointments > 0,
      },
    },
    {
      icon: <Clock size={22} />,
      title: 'Upcoming Appointments',
      number: upcomingAppointments.toString(),
      subtitle: `${todayAppointments} scheduled for today`,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700',
      trend: {
        value: todayAppointments > 0 ? 'Busy day ahead' : 'Light schedule',
        isPositive: todayAppointments > 0,
      },
    },
    {
      icon: <Users size={22} />,
      title: 'Unique Patients',
      number: uniquePatients.toString(),
      subtitle:
        uniquePatients > 0 ? 'Individual patients served' : 'No patients yet',
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700',
      trend: {
        value: uniquePatients > 0 ? 'Growing practice' : 'New practice',
        isPositive: uniquePatients > 0,
      },
    },
    {
      icon: <Video size={22} />,
      title: 'Video Consultations',
      number: videoAppointments.toString(),
      subtitle:
        videoAppointments > 0
          ? 'Virtual appointments setup'
          : 'No video calls scheduled',
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-700',
      trend: {
        value:
          totalAppointments > 0
            ? `${Math.round((videoAppointments / totalAppointments) * 100)}% virtual`
            : 'No virtual appointments',
        isPositive: videoAppointments > 0,
      },
    },
    {
      icon: <FileText size={22} />,
      title: 'Prescriptions Issued',
      number: totalPrescriptions.toString(),
      subtitle:
        totalPrescriptions > 0
          ? 'Medications prescribed'
          : 'No prescriptions yet',
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      textColor: 'text-slate-700',
      trend: {
        value:
          totalPrescriptions > 0 ? 'Active prescriber' : 'No prescriptions',
        isPositive: totalPrescriptions > 0,
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statData.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            ></div>

            {/* Content */}
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 truncate">
                    {stat.title}
                  </h3>

                  {/* Main Number */}
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900 leading-none">
                      {stat.number}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-500 leading-tight line-clamp-2">
                    {stat.subtitle}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`${stat.iconBg} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ml-3`}
                >
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
              </div>

              {/* Trend Indicator */}
              {stat.trend && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`w-3 h-3 ${
                        stat.trend.isPositive
                          ? 'text-green-500'
                          : 'text-gray-400 rotate-180'
                      }`}
                    />
                    <span className="text-xs text-gray-400">Trend</span>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      stat.trend.isPositive ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {stat.trend.value}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Summary Section */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              <img
                src={doctorData?.user?.imagelink || ''}
                alt="Doctor Avatar"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {doctorData?.user?.firstname} {doctorData?.user?.lastname}
              </h3>
              <p className="text-gray-600">{doctorData?.specialization}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>{doctorData?.experience} years experience</span>
                <span className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${doctorData?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  {doctorData?.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {confirmedAppointments}
              </div>
              <div className="text-xs text-gray-500">Confirmed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {pendingAppointments}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {uniquePatients}
              </div>
              <div className="text-xs text-gray-500">Patients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {totalPrescriptions}
              </div>
              <div className="text-xs text-gray-500">Prescriptions</div>
            </div>
          </div>
        </div>

        {/* Progress Bar for Appointment Status */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Appointment Status Distribution</span>
            <span>{totalAppointments} total</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
            {totalAppointments > 0 && (
              <>
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 transition-all duration-500"
                  style={{
                    width: `${(confirmedAppointments / totalAppointments) * 100}%`,
                  }}
                ></div>
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 transition-all duration-500"
                  style={{
                    width: `${(pendingAppointments / totalAppointments) * 100}%`,
                  }}
                ></div>
              </>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Confirmed: {confirmedAppointments}</span>
            <span>Pending: {pendingAppointments}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorStatCard
