/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react'
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
} from 'lucide-react'
import { usePatient } from '@/hooks/usePatients'
import { useAuthStore } from '@/store/authStore'
import { PrescriptionStatus } from '@/types/types'

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

const PatientStatCard: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const patientId = Number(user?.patient?.id)
  const { data: patientData, isLoading, error } = usePatient(patientId)

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
      <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-red-600 font-medium">
            Error loading patient data
          </div>
          <div className="text-red-500 text-sm mt-1">{error.message}</div>
        </div>
      </div>
    )
  }

  const totalPayments = patientData?.payments?.reduce(
    (acc, payment) => acc + (payment.amount ?? 0),
    0,
  )

  const upcomingAppointments =
    patientData?.appointments?.filter(
      (apt) => apt.status === 'confirmed' || apt.status === 'pending',
    )?.length ?? 0

  const allPrescriptions = patientData?.prescriptions?.length ?? 0
  const activePrescriptions =
    patientData?.prescriptions?.filter(
      (p) => p.status === PrescriptionStatus.ACTIVE,
    )?.length ?? 0
  const pendingPrescriptions =
    patientData?.prescriptions?.filter(
      (p) => p.status === PrescriptionStatus.INACTIVE,
    )?.length ?? 0
  const completedPrescriptions =
    patientData?.prescriptions?.filter((p) => p.status === 'completed')
      ?.length ?? 0

  const statData: Array<StatCardData> = [
    {
      icon: <Calendar size={24} />,
      title: 'Upcoming Appointments',
      number: upcomingAppointments.toString(),
      subtitle:
        upcomingAppointments > 0
          ? `Next: ${new Date().toLocaleDateString()}`
          : 'No upcoming appointments',
      trend: {
        value: upcomingAppointments > 0 ? 'Scheduled' : 'Book now',
        isPositive: upcomingAppointments > 0,
      },
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      iconGradient: 'from-indigo-400 to-purple-400',
      shadowColor: 'shadow-indigo-500/25',
    },
    {
      icon: <FileText size={24} />,
      title: 'All Prescriptions',
      number: allPrescriptions.toString(),
      subtitle:
        allPrescriptions > 0
          ? `Total medications prescribed`
          : 'No prescriptions yet',
      trend: {
        value: allPrescriptions > 0 ? 'Active records' : 'No records',
        isPositive: allPrescriptions > 0,
      },
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      iconGradient: 'from-slate-400 to-slate-500',
      shadowColor: 'shadow-slate-500/25',
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Active Prescriptions',
      number: activePrescriptions.toString(),
      subtitle:
        activePrescriptions > 0
          ? 'Currently taking medications'
          : 'No active medications',
      trend: {
        value: activePrescriptions > 0 ? 'Taking meds' : 'None active',
        isPositive: activePrescriptions > 0,
      },
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      iconGradient: 'from-emerald-300 to-teal-300',
      shadowColor: 'shadow-emerald-500/25',
    },
    {
      icon: <Clock size={24} />,
      title: 'Pending Prescriptions',
      number: pendingPrescriptions.toString(),
      subtitle:
        pendingPrescriptions > 0
          ? 'Awaiting pharmacy pickup'
          : 'No pending prescriptions',
      trend: {
        value: pendingPrescriptions > 0 ? 'Pickup ready' : 'None pending',
        isPositive: pendingPrescriptions === 0,
      },
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      iconGradient: 'from-amber-300 to-orange-300',
      shadowColor: 'shadow-amber-500/25',
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Total Payments',
      number: `$${totalPayments?.toFixed(0) ?? '0'}`,
      subtitle: `${patientData?.payments?.length ?? 0} transactions completed`,
      trend: {
        value: totalPayments && totalPayments > 0 ? 'Paid' : 'No payments',
        isPositive: true,
      },
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      iconGradient: 'from-green-300 to-emerald-300',
      shadowColor: 'shadow-green-500/25',
    },
  ]

  return (
    <div className="p-2 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Healthcare Dashboard
        </h1>
        <p className="text-gray-600">
          Personal health overview and treatment progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

      {/* Healthcare Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Prescription Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Prescription Status
            </h3>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">
                {activePrescriptions > 0 ? 'Active' : 'None Active'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Active Medications</span>
                <span>
                  {activePrescriptions}/{allPrescriptions}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width:
                      allPrescriptions > 0
                        ? `${(activePrescriptions / allPrescriptions) * 100}%`
                        : '0%',
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {pendingPrescriptions}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {completedPrescriptions}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Healthcare Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Healthcare Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
              <div className="text-xl font-bold text-indigo-600">
                {upcomingAppointments}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Active Meds</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                {activePrescriptions}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Total Paid</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                ${totalPayments?.toFixed(0) ?? '0'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Prescriptions</span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                {allPrescriptions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientStatCard
