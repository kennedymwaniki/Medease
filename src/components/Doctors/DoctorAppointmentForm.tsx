import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Calendar, CheckCircle, Clock, Search, User } from 'lucide-react'

import { toast } from 'sonner'
import type { Patient } from '@/types/types'
import { AppointmentStatus } from '@/types/types'
import { usePatients } from '@/hooks/usePatients'
import { useGetDoctorAvailableTimes } from '@/hooks/useDoctors'
import { useCreateAppointment } from '@/hooks/useAppointments'
import { useAuthStore } from '@/store/authStore'

// Zod schema for appointment form validation
const appointmentSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => {
      const appointmentDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return appointmentDate >= today
    }, 'Appointment date must be today or in the future'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      'Please select a valid time',
    ),
  duration: z
    .number()
    .min(10, 'Duration must be at least 10 minutes')
    .max(60, 'Duration cannot exceed 60 minutes'),
  appointmentType: z.string().min(1, 'Please select an appointment type'),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

interface DoctorAppointmentFormProps {
  onAppointmentSuccess?: (appointmentDetails: any) => void
}

const DoctorAppointmentForm = ({
  onAppointmentSuccess,
}: DoctorAppointmentFormProps) => {
  const { data: patients, isLoading, error } = usePatients()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { createAppointment } = useCreateAppointment()
  const user = useAuthStore((state) => state.user)
  const doctorId = Number(user?.doctor?.id)

  const form = useForm({
    defaultValues: {
      date: '',
      time: '',
      duration: 30,
      appointmentType: '',
    } satisfies AppointmentFormData,
    onSubmit: ({ value }) => {
      const result = appointmentSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      const appointmentData = {
        doctorId,
        patientId: Number(selectedPatient?.id),
        time: value.time,
        date: value.date,
        status: AppointmentStatus.PENDING,
        duration: value.duration,
        title: value.appointmentType,
      }

      createAppointment(appointmentData)
      toast.success('Appointment scheduled successfully!')

      // Call the success callback with appointment details
      if (onAppointmentSuccess) {
        onAppointmentSuccess({
          patientName: selectedPatient?.name,
          date: new Date(value.date).toLocaleDateString(),
          time: new Date(`2000-01-01T${value.time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          duration: value.duration,
          appointmentType: value.appointmentType,
        })
      }

      // Reset form and go back to step 1
      form.reset()
      setSelectedPatient(null)
      setCurrentStep(1)
      setSearchTerm('')
    },
  })

  // Fetch available times whenever selectedDate changes
  const {
    data: availableTimes,
    isLoading: isLoadingAvailableTimes,
    error: availableTimesError,
    refetch: refetchAvailableTimes,
  } = useGetDoctorAvailableTimes(doctorId, selectedDate)

  // Effect to refetch available times when selectedDate changes
  useEffect(() => {
    if (selectedDate && doctorId) {
      refetchAvailableTimes()
    }
  }, [selectedDate, doctorId, refetchAvailableTimes])

  // Subscribe to form changes to keep selectedDate in sync and reset time when date changes
  form.Subscribe({
    selector: (state) => state.values.date,
    children: (currentDate) => {
      if (currentDate !== selectedDate) {
        setSelectedDate(currentDate)
        form.setFieldValue('time', '')
      }
      return null
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading patients</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  // Filter patients based on search term
  const filteredPatients =
    patients?.filter((patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setCurrentStep(2)
  }

  const handleDateTimeSubmit = () => {
    const formValues = form.state.values
    const isValid = form.state.isValid

    if (
      isValid &&
      formValues.date &&
      formValues.time &&
      formValues.appointmentType
    ) {
      setCurrentStep(3)
    }
  }

  const StepIndicator = ({
    step,
    currentStep: stepNumber,
  }: {
    step: number
    currentStep: number
  }) => (
    <div
      className={`flex items-center ${
        step < stepNumber
          ? 'text-blue-500'
          : step === stepNumber
            ? 'text-blue-600'
            : 'text-gray-400'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step < stepNumber
            ? 'bg-blue-500 text-white'
            : step === stepNumber
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
        }`}
      >
        {step < stepNumber ? <CheckCircle size={16} /> : step}
      </div>
    </div>
  )

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          {patient.user.imagelink ? (
            <img
              src={patient.user.imagelink}
              alt={patient.name ?? undefined}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Age: {patient.age}</p>
          <p className="text-sm text-gray-600">Gender: {patient.gender}</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => handlePatientSelect(patient)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Select Patient
        </button>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? 'No patients found matching your search.'
                : 'No patients available.'}
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Selected Patient</h3>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {selectedPatient?.user.imagelink ? (
              <img
                src={selectedPatient.user.imagelink}
                alt={selectedPatient.name ?? 'patient'}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{selectedPatient?.name}</h4>
            <p className="text-sm text-gray-600">Age: {selectedPatient?.age}</p>
            <p className="text-sm text-gray-600">
              Gender: {selectedPatient?.gender}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
        <div className="space-y-4">
          {/* Date Field */}
          <form.Field
            name="date"
            validators={{
              onChange: ({ value }) =>
                validateField(value, appointmentSchema.shape.date),
              onBlur: ({ value }) =>
                validateField(value, appointmentSchema.shape.date),
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => {
                    const newDate = e.target.value
                    field.handleChange(newDate)
                    setSelectedDate(newDate)
                    form.setFieldValue('time', '')
                  }}
                  onBlur={field.handleBlur}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />

          {/* Time Field */}
          <form.Field
            name="time"
            validators={{
              onChange: ({ value }) =>
                validateField(value, appointmentSchema.shape.time),
              onBlur: ({ value }) =>
                validateField(value, appointmentSchema.shape.time),
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                {!selectedDate ? (
                  <p className="text-gray-500">Please select a date first</p>
                ) : isLoadingAvailableTimes ? (
                  <p>Loading available times...</p>
                ) : availableTimesError ? (
                  <p className="text-red-500">
                    Error loading times: {availableTimesError.message}
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes?.length === 0 && (
                      <p className="col-span-3 text-gray-600">
                        No available slots for this date.
                      </p>
                    )}
                    {availableTimes?.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          const timeValue = slot.startTime
                          field.handleChange(timeValue)
                        }}
                        disabled={slot.status === 'booked'}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                          ${
                            slot.status === 'available'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed line-through'
                          }
                          ${
                            field.state.value === slot.startTime
                              ? 'ring-2 ring-blue-500 ring-offset-2'
                              : ''
                          }
                        `}
                      >
                        {new Date(
                          `2000-01-01T${slot.startTime}`,
                        ).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </button>
                    ))}
                  </div>
                )}
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />

          {/* Duration Field */}
          <form.Field
            name="duration"
            validators={{
              onChange: ({ value }) =>
                validateField(value, appointmentSchema.shape.duration),
              onBlur: ({ value }) =>
                validateField(value, appointmentSchema.shape.duration),
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(parseInt(e.target.value))}
                  onBlur={field.handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />

          {/* Appointment Type Field */}
          <form.Field
            name="appointmentType"
            validators={{
              onChange: ({ value }) =>
                validateField(value, appointmentSchema.shape.appointmentType),
              onBlur: ({ value }) =>
                validateField(value, appointmentSchema.shape.appointmentType),
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Emergency">Emergency</option>
                </select>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isValid]}
            children={([canSubmit, isValid]) => (
              <button
                onClick={handleDateTimeSubmit}
                disabled={!canSubmit || !isValid}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Confirmation
              </button>
            )}
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-6">Appointment Summary</h3>

        <form.Subscribe
          selector={(state) => state.values}
          children={(values) => (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {selectedPatient?.user.imagelink ? (
                    <img
                      src={selectedPatient.user.imagelink}
                      alt={selectedPatient.name ?? 'Patient'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected Patient</p>
                  <h4 className="font-medium">{selectedPatient?.name}</h4>
                  <p className="text-sm text-gray-600">
                    Age: {selectedPatient?.age}, Gender:{' '}
                    {selectedPatient?.gender}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {values.date &&
                        new Date(values.date).toLocaleDateString()}{' '}
                      at {values.time}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{values.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Appointment Type</p>
                <p className="text-sm mt-1">{values.appointmentType}</p>
              </div>
            </div>
          )}
        />

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit()
                }}
                disabled={!canSubmit}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            )}
          />
        </div>
      </div>
    </div>
  )

  const steps = [
    { number: 1, title: 'Patient Selection' },
    { number: 2, title: 'Date & Time' },
    { number: 3, title: 'Confirmation' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Schedule Appointment
          </h1>
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center space-x-2">
                <StepIndicator step={step.number} currentStep={currentStep} />
                <span
                  className={`text-sm ${
                    currentStep >= step.number
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  )
}

export default DoctorAppointmentForm
