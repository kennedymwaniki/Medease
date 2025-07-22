import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { usePatient } from '@/hooks/usePatients'
import { useUpdateUser } from '@/hooks/useUser'
import { useAuthStore } from '@/store/authStore'

// Zod schema for patient profile form validation
const patientProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  age: z
    .number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120')
    .int('Age must be a whole number'),
  gender: z
    .string()
    .min(1, 'Please select a gender')
    .refine(
      (val) => ['male', 'female', 'other'].includes(val.toLowerCase()),
      'Please select a valid gender',
    ),
  contact: z
    .string()
    .min(1, 'Contact is required')
    .max(20, 'Contact must be less than 20 characters')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
})

type PatientProfileFormData = z.infer<typeof patientProfileSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

interface PatientProfileFormProps {
  onSuccess?: () => void
}

const PatientProfileForm: React.FC<PatientProfileFormProps> = ({
  onSuccess,
}) => {
  const user = useAuthStore((state) => state.user)
  const userId = Number(user?.id)
  const { updateUserProfile, error, isPending } = useUpdateUser()

  const form = useForm({
    defaultValues: {
      name: '',
      age: 0,
      gender: '',
      contact: '',
      address: '',
    } satisfies PatientProfileFormData,
    onSubmit: ({ value }) => {
      const result = patientProfileSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      const profileData = {
        userId,
        data: {
          firstname: result.data.name,
          age: result.data.age,
          gender: result.data.gender,
          contact: result.data.contact,
          address: result.data.address,
        },
      }

      console.log('Patient profile data:', profileData)
      updateUserProfile(profileData)

      form.reset()
      onSuccess?.()
    },
  })

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-red-500">
          Error updating profile: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Name Field */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            validateField(value, patientProfileSchema.shape.name),
          onBlur: ({ value }) =>
            validateField(value, patientProfileSchema.shape.name),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
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
              placeholder="Enter your full name"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Age Field */}
      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            validateField(value, patientProfileSchema.shape.age),
          onBlur: ({ value }) =>
            validateField(value, patientProfileSchema.shape.age),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id={field.name}
              name={field.name}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter your age"
              min="1"
              max="120"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Gender Field */}
      <form.Field
        name="gender"
        validators={{
          onChange: ({ value }) =>
            validateField(value, patientProfileSchema.shape.gender),
          onBlur: ({ value }) =>
            validateField(value, patientProfileSchema.shape.gender),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
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
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Contact Field */}
      <form.Field
        name="contact"
        validators={{
          onChange: ({ value }) =>
            validateField(value, patientProfileSchema.shape.contact),
          onBlur: ({ value }) =>
            validateField(value, patientProfileSchema.shape.contact),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number
            </label>
            <input
              type="tel"
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
              placeholder="Enter your phone number"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      />

      {/* Address Field */}
      <form.Field
        name="address"
        validators={{
          onChange: ({ value }) =>
            validateField(value, patientProfileSchema.shape.address),
          onBlur: ({ value }) =>
            validateField(value, patientProfileSchema.shape.address),
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter your address"
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
              disabled={!canSubmit || isPending}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                canSubmit && !isPending
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
            >
              {isSubmitting || isPending
                ? 'Updating Profile...'
                : 'Update Profile'}
            </button>
          )}
        />
      </div>
    </div>
  )
}

export default PatientProfileForm
