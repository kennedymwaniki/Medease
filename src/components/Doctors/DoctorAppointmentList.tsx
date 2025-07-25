// import type { Appointment } from '@/types/types'
import type { Appointment } from '@/types/types'
import { useDoctor } from '@/hooks/useDoctors'
import { useAuthStore } from '@/store/authStore'

const DoctorAppointmentList = () => {
  const user = useAuthStore((state) => state.user)
  const doctorId = user?.doctor?.id

  const { data: doctorData, isLoading, error } = useDoctor(doctorId!)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Filter appointments for today
  const todayAppointments =
    doctorData?.appointments.filter(
      (appointment) => appointment.date === today,
    ) || []

  // Sort appointments by time
  const sortedAppointments = todayAppointments.sort((a, b) => {
    const timeA = a.time.includes(':') ? a.time : `${a.time}:00`
    const timeB = b.time.includes(':') ? b.time : `${b.time}:00`
    return timeA.localeCompare(timeB)
  })

  const formatTime = (timeString: string | Array<string>) => {
    const time = timeString.includes(':') ? timeString : `${timeString}:00`
    const timeStr = Array.isArray(time) ? time[0] : time
    const [hours, minutes] = timeStr.split(':')
    const hour24 = parseInt(hours)
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  // const getStatusColor = (status: any) => {
  //   switch (status) {
  //     case 'pending':
  //       return 'bg-blue-100 text-blue-800'
  //     case 'completed':
  //       return 'bg-green-100 text-green-800'
  //     case 'cancelled':
  //       return 'bg-red-100 text-red-800'
  //     default:
  //       return 'bg-gray-100 text-gray-800'
  //   }
  // }

  const getPatientInitials = (title: string) => {
    // Generate initials from appointment title or use generic ones
    if (title === 'Consultation') return 'ED'
    if (title === 'Follow-up') return 'MC'
    if (title === 'Check-up') return 'SW'
    if (title === 'Emergency') return 'EM'
    return 'PT'
  }

  const getPatientName = (index: number) => {
    // Generate patient names based on appointment type and index
    const names = [
      'Emily Davis',
      'Michael Chen',
      'Sarah Wilson',
      'David Johnson',
      'Lisa Anderson',
      'Robert Brown',
      'Jennifer Taylor',
      'James Wilson',
    ]
    return names[index % names.length] || 'Patient'
  }

  const getAppointmentStatus = (appointment: Appointment, index: number) => {
    // Simulate different statuses based on time and index
    const currentTime = new Date()
    const timeStr = Array.isArray(appointment.time)
      ? appointment.time[0]
      : appointment.time
    const [hours, minutes] = timeStr.split(':')
    const appointmentTime = new Date()
    appointmentTime.setHours(parseInt(hours), parseInt(minutes), 0)

    if (index === 0) return 'In Progress'
    if (appointmentTime < currentTime) return 'Completed'
    return 'Scheduled'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Appointment Skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-l-4 border-gray-200 bg-gray-50 rounded-r-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Error loading appointments</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Today's Schedule
        </h2>
        <p className="text-gray-600">
          {sortedAppointments.length} appointments scheduled
        </p>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          sortedAppointments.map((appointment, index) => {
            const status = getAppointmentStatus(appointment, index)
            const patientName = getPatientName(index)
            const initials = getPatientInitials(appointment.title)

            return (
              <div
                key={appointment.id}
                className={`flex items-center justify-between p-4 rounded-r-lg border-l-4 ${
                  status === 'In Progress'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Patient Avatar */}
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                    {initials}
                  </div>

                  {/* Patient Info */}
                  <div>
                    <h3 className="font-medium text-gray-900">{patientName}</h3>
                    <p className="text-sm text-gray-600">
                      {appointment.title} • {formatTime(appointment.time)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {status === 'In Progress' ? (
                    <>
                      <span className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md">
                        In Progress
                      </span>
                      <button className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </>
                  ) : status === 'Completed' ? (
                    <>
                      <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-md">
                        Completed
                      </span>
                      <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-md">
                        Scheduled
                      </span>
                      <button className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Start
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default DoctorAppointmentList
