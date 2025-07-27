/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react'
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react'
import { usePatient } from '@/hooks/usePatients'
import { useAuthStore } from '@/store/authStore'
import { PrescriptionStatus } from '@/types/types'

interface StatCardData {
  icon: React.ReactNode
  title: string
  number: string
  subtitle: string
  gradient: string
  iconBg: string
  iconColor: string
  textColor: string
}

const PatientStatCard: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const patientId = Number(user?.patient?.id)
  const { data: patientData, isLoading, error } = usePatient(patientId)

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
      icon: <Calendar size={22} />,
      title: 'Upcoming Appointments',
      number: upcomingAppointments.toString(),
      subtitle:
        upcomingAppointments > 0
          ? `Next: ${new Date().toLocaleDateString()}`
          : 'No upcoming appointments',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-700',
    },
    {
      icon: <FileText size={22} />,
      title: 'All Prescriptions',
      number: allPrescriptions.toString(),
      subtitle:
        allPrescriptions > 0
          ? `Total medications prescribed`
          : 'No prescriptions yet',
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      textColor: 'text-slate-700',
    },
    {
      icon: <CheckCircle size={22} />,
      title: 'Active Prescriptions',
      number: activePrescriptions.toString(),
      subtitle:
        activePrescriptions > 0
          ? 'Currently taking medications'
          : 'No active medications',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700',
    },
    {
      icon: <Clock size={22} />,
      title: 'Pending Prescriptions',
      number: pendingPrescriptions.toString(),
      subtitle:
        pendingPrescriptions > 0
          ? 'Awaiting pharmacy pickup'
          : 'No pending prescriptions',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-700',
    },
    {
      icon: <DollarSign size={22} />,
      title: 'Total Payments',
      number: `$${totalPayments?.toFixed(0) ?? '0'}`,
      subtitle: `${patientData?.payments?.length ?? 0} transactions completed`,
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statData.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
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

              {/* Bottom Section */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
                  ></div>
                  <span className="text-xs text-gray-400">Status</span>
                </div>
                <span className={`text-xs font-medium ${stat.textColor}`}>
                  {parseInt(stat.number.replace('$', '')) > 0 ||
                  stat.number !== '0'
                    ? 'Active'
                    : 'None'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-300 rounded-2xl p-6 border-2 border-gray-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Healthcare Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total Prescriptions:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {allPrescriptions}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Active:</span>
                <span className="ml-2 font-semibold text-emerald-600">
                  {activePrescriptions}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Pending:</span>
                <span className="ml-2 font-semibold text-amber-600">
                  {pendingPrescriptions}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Completed:</span>
                <span className="ml-2 font-semibold text-slate-600">
                  {completedPrescriptions}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full lg:w-64">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Prescription Status</span>
              <span>
                {activePrescriptions}/{allPrescriptions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width:
                    allPrescriptions > 0
                      ? `${(activePrescriptions / allPrescriptions) * 100}%`
                      : '0%',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientStatCard

// /* eslint-disable @typescript-eslint/no-unnecessary-condition */
// import React from 'react'
// import {
//   Activity,
//   Bell,
//   Calendar,
//   DollarSign,
//   Pill,
//   TrendingUp,
//   Clock,
//   CheckCircle,
// } from 'lucide-react'
// import { usePatient } from '@/hooks/usePatients'
// import { useAuthStore } from '@/store/authStore'

// interface StatCardData {
//   icon: React.ReactNode
//   title: string
//   number: string
//   subtitle: string
//   bgGradient: string
//   iconBg: string
//   iconColor: string
//   trend?: {
//     value: string
//     isPositive: boolean
//   }
// }

// const PatientStatCard: React.FC = () => {
//   const user = useAuthStore((state) => state.user)
//   const patientId = Number(user?.patient?.id)
//   const { data: patientData, isLoading, error } = usePatient(patientId)

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
//         {[...Array(4)].map((_, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="space-y-3 flex-1">
//                 <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-1/2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-full"></div>
//               </div>
//               <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
//           <div className="text-red-600 font-medium">
//             Error loading patient data
//           </div>
//           <div className="text-red-500 text-sm mt-1">{error.message}</div>
//         </div>
//       </div>
//     )
//   }

//   const totalPayments = patientData?.payments?.reduce(
//     (acc, payment) => acc + (payment.amount ?? 0),
//     0,
//   )

//   const upcomingAppointments =
//     patientData?.appointments?.filter(
//       (apt) => apt.status === 'confirmed' || apt.status === 'pending',
//     )?.length ?? 0

//   const activePrescriptions =
//     patientData?.prescriptions?.filter((p) => p.status === 'active')?.length ??
//     0

//   const completedPayments =
//     patientData?.payments?.filter((p) => p.status === 'completed')?.length ?? 0

//   const statData: Array<StatCardData> = [
//     {
//       icon: <Calendar size={20} />,
//       title: 'Upcoming Appointments',
//       number: upcomingAppointments.toString(),
//       subtitle:
//         upcomingAppointments > 0
//           ? 'Next: Dr. Smith - Cardiology'
//           : 'No upcoming appointments',
//       bgGradient: 'from-blue-500 to-blue-600',
//       iconBg: 'bg-blue-100',
//       iconColor: 'text-blue-600',
//       trend: {
//         value: upcomingAppointments > 0 ? '+2 this week' : 'Schedule now',
//         isPositive: true,
//       },
//     },
//     {
//       icon: <DollarSign size={20} />,
//       title: 'Total Payments',
//       number: completedPayments.toString(),
//       subtitle: `Amount: $${totalPayments?.toFixed(2) ?? '0.00'}`,
//       bgGradient: 'from-emerald-500 to-emerald-600',
//       iconBg: 'bg-emerald-100',
//       iconColor: 'text-emerald-600',
//       trend: {
//         value: completedPayments > 0 ? 'All settled' : 'No payments',
//         isPositive: true,
//       },
//     },
//     {
//       icon: <Pill size={20} />,
//       title: 'Active Prescriptions',
//       number: activePrescriptions.toString(),
//       subtitle:
//         activePrescriptions > 0
//           ? 'All medications current'
//           : 'No active prescriptions',
//       bgGradient: 'from-purple-500 to-purple-600',
//       iconBg: 'bg-purple-100',
//       iconColor: 'text-purple-600',
//       trend: {
//         value: activePrescriptions > 0 ? 'Up to date' : 'None active',
//         isPositive: activePrescriptions > 0,
//       },
//     },
//     {
//       icon: <Activity size={20} />,
//       title: 'Health Score',
//       number: '85%',
//       subtitle: 'Overall health status',
//       bgGradient: 'from-orange-500 to-orange-600',
//       iconBg: 'bg-orange-100',
//       iconColor: 'text-orange-600',
//       trend: {
//         value: '+5% this month',
//         isPositive: true,
//       },
//     },
//   ]

//   return (
//     <div className="p-4 space-y-4">
//       {/* Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statData.map((stat, index) => (
//           <div
//             key={index}
//             className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
//           >
//             {/* Header with Icon */}
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2">
//                   <h3 className="text-sm font-semibold text-gray-600 truncate">
//                     {stat.title}
//                   </h3>
//                 </div>

//                 {/* Main Number */}
//                 <div className="flex items-baseline gap-2 mb-2">
//                   <span className="text-3xl font-bold text-gray-900 leading-none">
//                     {stat.number}
//                   </span>
//                   {stat.trend && (
//                     <div
//                       className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
//                         stat.trend.isPositive
//                           ? 'bg-green-50 text-green-700'
//                           : 'bg-red-50 text-red-700'
//                       }`}
//                     >
//                       <TrendingUp
//                         className={`w-3 h-3 ${
//                           stat.trend.isPositive
//                             ? 'text-green-600'
//                             : 'text-red-600 rotate-180'
//                         }`}
//                       />
//                       <span>{stat.trend.value}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Subtitle */}
//                 <p className="text-sm text-gray-500 leading-tight">
//                   {stat.subtitle}
//                 </p>
//               </div>

//               {/* Icon */}
//               <div
//                 className={`${stat.iconBg} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
//               >
//                 <div className={stat.iconColor}>{stat.icon}</div>
//               </div>
//             </div>

//             {/* Progress Bar (optional visual enhancement) */}
//             <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
//               <div
//                 className={`bg-gradient-to-r ${stat.bgGradient} h-1.5 rounded-full transition-all duration-500`}
//                 style={{
//                   width:
//                     stat.title === 'Health Score'
//                       ? '85%'
//                       : parseInt(stat.number) > 0
//                         ? '75%'
//                         : '10%',
//                 }}
//               ></div>
//             </div>

//             {/* Status Indicator */}
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-gray-400">Status</span>
//               <div className="flex items-center gap-1">
//                 <CheckCircle className="w-3 h-3 text-green-500" />
//                 <span className="text-green-600 font-medium">Active</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions Bar */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-1">Quick Actions</h3>
//             <p className="text-sm text-gray-600">
//               Manage your healthcare efficiently
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//               <Calendar className="w-4 h-4 text-blue-600" />
//               <span className="hidden sm:inline">Book Appointment</span>
//               <span className="sm:hidden">Book</span>
//             </button>

//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
//               <Pill className="w-4 h-4 text-purple-600" />
//               <span className="hidden sm:inline">View Prescriptions</span>
//               <span className="sm:hidden">Meds</span>
//             </button>

//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
//               <Bell className="w-4 h-4" />
//               <span className="hidden sm:inline">Set Reminders</span>
//               <span className="sm:hidden">Alerts</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PatientStatCard
