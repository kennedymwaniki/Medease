import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'

// Zod schema for verification code validation
const verificationSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

type VerificationFormData = z.infer<typeof verificationSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function OtpVerificationForm2() {
  const [email] = useState('k****@gmail.com')
  const [timer, setTimer] = useState(225) // 3:45 in seconds
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const form = useForm({
    defaultValues: {
      code: '',
    } satisfies VerificationFormData,
    onSubmit: async ({ value }) => {
      // Final validation before submission
      const result = verificationSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      console.log('Verification code submitted:', value.code)
      // Here you would typically send the code to your backend
      // For now, we're just logging it
      alert(`Verification code ${value.code} submitted successfully!`)
    },
  })

  const handleResendCode = () => {
    console.log('Resending code to:', email)
    setTimer(225) // Reset timer to 3:45
    setCanResend(false)
    // Here you would typically call your API to resend the code
  }

  const handleBackToLogin = () => {
    console.log('Navigating back to login')
    // Here you would typically navigate to login page
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
          Secure Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Verify Your Identity
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code sent to your email
            </p>
            <p className="text-sm font-medium text-gray-900 mb-6">{email}</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field
              name="code"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, verificationSchema.shape.code),
                onBlur: ({ value }) =>
                  validateField(value, verificationSchema.shape.code),
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                      field.handleChange(value)
                    }}
                    maxLength={6}
                    className={`w-full px-3 py-2 text-center text-lg tracking-widest border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="000000"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Code expires in {formatTime(timer)}
              </p>

              <div className="space-y-3">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        canSubmit && !isSubmitting
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-400 cursor-not-allowed text-gray-200'
                      }`}
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify Code'}
                    </button>
                  )}
                />

                <div className="text-sm">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-gray-500">
                      Didn't receive the code?
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-500 focus:outline-none"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          • HIPAA Compliant • Secure Medical Data
        </p>
      </footer>
    </div>
  )
}

export default OtpVerificationForm2
