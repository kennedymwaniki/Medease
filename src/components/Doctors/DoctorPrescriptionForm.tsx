import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useMedications } from '@/hooks/useMedications'
import { useAuthStore } from '@/store/authStore'
import { usecreatePrecsiption } from '@/hooks/usePrescriptions'
import { PrescriptionStatus } from '@/types/types'

// Zod schema for prescription form validation
const prescriptionSchema = z.object({
  medicationId: z.number().min(1, 'Please select a medication'),
  frequency: z
    .string()
    .min(1, 'Frequency is required')
    .max(100, 'Frequency must be less than 100 characters'),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(100, 'Duration must be less than 100 characters'),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must be less than 100 characters'),
  status: z
    .string()
    .min(1, 'Please select a status')
    .refine(
      (val) => ['active', 'completed', 'cancelled'].includes(val),
      'Please select a valid status',
    ),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const startDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return startDate >= today
    }, 'Start date must be today or in the future'),
  endDate: z.string().min(1, 'End date is required'),
})

type PrescriptionFormData = z.infer<typeof prescriptionSchema>

// Helper function to map form status to enum
const mapStatusToEnum = (status: string): PrescriptionStatus => {
  switch (status) {
    case 'active':
      return PrescriptionStatus.ACTIVE
    case 'completed':
      return PrescriptionStatus.COMPLETED
    case 'cancelled':
      return PrescriptionStatus.INACTIVE // or create a CANCELLED enum if needed
    default:
      return PrescriptionStatus.ACTIVE
  }
}

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

interface DoctorPrescriptionFormProps {
  patientId: number
  onSuccess?: () => void
}

const DoctorPrescriptionForm: React.FC<DoctorPrescriptionFormProps> = ({
  patientId,
  onSuccess,
}) => {
  const User = useAuthStore((state) => state.user)
  const doctorId = Number(User?.doctor?.id)
  const { medications, isLoading, error: medicationsError } = useMedications()
  const { addPrescription, error } = usecreatePrecsiption()

  const form = useForm({
    defaultValues: {
      medicationId: 0,
      frequency: '',
      duration: '',
      dosage: '',
      status: '',
      startDate: '',
      endDate: '',
    } satisfies PrescriptionFormData,
    onSubmit: ({ value }) => {
      // Final validation before submission
      const result = prescriptionSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      const prescriptionData = {
        ...value,
        doctorId,
        patientId,
        status: mapStatusToEnum(value.status),
        startDate: new Date(value.startDate),
        endDate: new Date(value.endDate),
      }

      console.log('Prescription data:', prescriptionData)
      addPrescription(prescriptionData)

      form.reset()

      onSuccess?.()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Loading medications...</div>
      </div>
    )
  }

  if (medicationsError) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-red-500">
          Error loading medications: {medicationsError.message}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-red-500">
          Error creating prescription: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Medication Selection */}
      <form.Field
        name="medicationId"
        validators={{
          onChange: ({ value }) =>
            validateField(value, prescriptionSchema.shape.medicationId),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.medicationId),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Medication
            </label>
            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value={0}>Select a medication</option>
              {medications?.map((medication) => (
                <option key={medication.id} value={medication.id}>
                  {medication.name} - {medication.dosage} ({medication.type})
                </option>
              ))}
            </select>
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Frequency Field */}
      <form.Field
        name="frequency"
        validators={{
          onChange: ({ value }) =>
            validateField(value, prescriptionSchema.shape.frequency),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.frequency),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Frequency
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="e.g., Twice a day, Once daily, Every 8 hours"
            />
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
            validateField(value, prescriptionSchema.shape.duration),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.duration),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duration
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="e.g., 7 days, 2 weeks, 1 month"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Dosage Field */}
      <form.Field
        name="dosage"
        validators={{
          onChange: ({ value }) =>
            validateField(value, prescriptionSchema.shape.dosage),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.dosage),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Dosage
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="e.g., 10mg, 5ml, 2 tablets"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Status Field */}
      <form.Field
        name="status"
        validators={{
          onChange: ({ value }) =>
            validateField(value, prescriptionSchema.shape.status),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.status),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Start Date Field */}
      <form.Field
        name="startDate"
        validators={{
          onChange: ({ value }) =>
            validateField(value, prescriptionSchema.shape.startDate),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.startDate),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

      {/* End Date Field */}
      <form.Field
        name="endDate"
        validators={{
          onChange: ({ value }) =>
            validateField(value, prescriptionSchema.shape.endDate),
          onBlur: ({ value }) =>
            validateField(value, prescriptionSchema.shape.endDate),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

      {/* Submit Button */}
      <div className="pt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
            >
              {isSubmitting
                ? 'Creating Prescription...'
                : 'Create Prescription'}
            </button>
          )}
        />
      </div>
    </div>
  )
}

export default DoctorPrescriptionForm
