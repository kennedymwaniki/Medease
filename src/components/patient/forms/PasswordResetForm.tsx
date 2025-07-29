import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { usePasswordResetRequest } from '@/hooks/useAuth'

// Zod schema for email validation
const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

type PasswordResetFormData = z.infer<typeof passwordResetSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function PasswordResetForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const { passwordResetMutation } = usePasswordResetRequest()

  const form = useForm({
    defaultValues: {
      email: '',
    } satisfies PasswordResetFormData,
    onSubmit: async ({ value }) => {
      // Final validation before submission
      const result = passwordResetSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      console.log('Password reset requested for:', value.email)

      // Simulate API call
      try {
        // Here you would typically call your API to send the reset code
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

        await passwordResetMutation(value.email)
        console.log('Reset code sent successfully')

        setSubmittedEmail(value.email)
        setIsSubmitted(true)

        setTimeout(() => {
          console.log('Redirecting to /otp-verification')
          window.location.href = '/otp-verification'
        }, 2000)
      } catch (error) {
        console.error('Failed to send reset code:', error)
        alert('Failed to send reset code. Please try again.')
      }
    },
  })

  const handleBackToLogin = () => {
    console.log('Navigating back to login')
    // Here you would typically navigate to login page
    window.location.href = '/login'
    // or using React Router: navigate('/login')
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">MedEase</h1>
            <p className="text-center text-gray-600 mb-8">
              Medical Management System
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-2">
              We've sent a 6-digit verification code to:
            </p>
            <p className="font-medium text-gray-900 mb-6">{submittedEmail}</p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your email and enter the code on the next page to
              reset your password.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to verification page in a moment...
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            • HIPAA Compliant • Secure Medical Data
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          MedEase
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Medical Management System
        </p>
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-center text-sm text-gray-600">
          Enter your registered email address and we'll send you a verification
          code
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, passwordResetSchema.shape.email),
                onBlur: ({ value }) =>
                  validateField(value, passwordResetSchema.shape.email),
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="space-y-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      form.handleSubmit()
                    }}
                    disabled={!canSubmit || isSubmitting}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      canSubmit && !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-gray-200'
                    }`}
                  >
                    {isSubmitting
                      ? 'Sending Code...'
                      : 'Send Verification Code'}
                  </button>
                )}
              />

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-500 focus:outline-none flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              By requesting a password reset, you confirm that this email
              address is associated with your MedEase account and you have
              access to this email.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          • HIPAA Compliant • Secure Medical Data
        </p>
      </div>
    </div>
  )
}

export default PasswordResetForm
