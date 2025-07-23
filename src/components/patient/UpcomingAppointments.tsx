import React from 'react'
import { Calendar, Eye, Stethoscope, UserCheck } from 'lucide-react'
import { usePatient } from '@/hooks/usePatients'
import { useAuthStore } from '@/store/authStore'

interface AppointmentIconProps {
  title: string
}

const AppointmentIcon: React.FC<AppointmentIconProps> = ({ title }) => {
  const getIconAndColor = (appointmentTitle: string) => {
    const titleLower = appointmentTitle.toLowerCase()

    if (titleLower.includes('cardiology') || titleLower.includes('heart')) {
      return {
        icon: <Stethoscope className="w-6 h-6 text-white" />,
        bgColor: 'bg-blue-500',
      }
    } else if (
      titleLower.includes('ophthalmology') ||
      titleLower.includes('eye')
    ) {
      return {
        icon: <Eye className="w-6 h-6 text-white" />,
        bgColor: 'bg-purple-500',
      }
    } else if (
      titleLower.includes('dental') ||
      titleLower.includes('dentist')
    ) {
      return {
        icon: <UserCheck className="w-6 h-6 text-white" />,
        bgColor: 'bg-green-500',
      }
    } else {
      return {
        icon: <Calendar className="w-6 h-6 text-white" />,
        bgColor: 'bg-gray-500',
      }
    }
  }

  const { icon, bgColor } = getIconAndColor(title)

  return (
    <div
      className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
  )
}

const UpcomingAppointments: React.FC = () => {
  const user = useAuthStore((state) => state.user)

  console.log('User from auth store:', user)
  const patientId = Number(user?.patient?.id)
  const { data: patientData, isLoading, error } = usePatient(patientId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-36"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Appointments
        </h2>
        <div className="text-red-600 text-sm">Error loading appointments</div>
      </div>
    )
  }

  // Filter and sort upcoming appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingAppointments =
    patientData?.appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        appointmentDate.setHours(0, 0, 0, 0)
        return appointmentDate >= today
      })
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 3) || [] // Show only first 3 upcoming appointments

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    // Handle different time formats
    const time = timeString.toLowerCase()
    if (time.includes('am') || time.includes('pm')) {
      return timeString
    }

    // If time is in 24-hour format, convert to 12-hour
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'confirmed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Confirmed
        </span>
      )
    } else if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      )
    } else if (statusLower === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    )
  }

  const getDoctorName = (title: string) => {
    // Extract doctor name from title or use default based on specialty
    if (title.toLowerCase().includes('cardiology')) {
      return 'Dr. Michael Smith'
    } else if (title.toLowerCase().includes('ophthalmology')) {
      return 'Dr. Emily Davis'
    } else if (title.toLowerCase().includes('dental')) {
      return 'Dr. Sarah Johnson'
    } else {
      return 'Dr. General Practitioner'
    }
  }

  const getRoomNumber = (appointmentId: number) => {
    // Generate room number based on appointment ID for consistency
    const rooms = ['204', '108', '302', '156', '201', '309']
    return `Room ${rooms[appointmentId % rooms.length]}`
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Upcoming Appointments
        </h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          View All
        </button>
      </div>

      {upcomingAppointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No upcoming appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-4">
                <AppointmentIcon title={appointment.title} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {getDoctorName(appointment.title)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {appointment.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(appointment.status)}
                      <span className="text-xs text-gray-500">
                        {getRoomNumber(appointment.id)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-600 font-medium">
                      {formatDate(appointment.date)} at{' '}
                      {formatTime(appointment.time)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {appointment.duration} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UpcomingAppointments
