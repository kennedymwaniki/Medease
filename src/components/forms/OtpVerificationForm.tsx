import React from 'react'
import { useForm } from '@tanstack/react-form'

interface VerificationFormProps {
  email: string
  onSubmit: (code: string) => void
  onResend: () => void
  onBack: () => void
}

const OtpVerificationForm: React.FC<VerificationFormProps> = ({
  email,
  onSubmit,
  onResend,
  onBack,
}) => {
  const form = useForm({
    defaultValues: {
      code: ['', '', '', '', '', ''], // 6-digit code
    },
    onSubmit: ({ value }) => {
      const fullCode = value.code.join('')
      onSubmit(fullCode)
    },
  })

  // Handle input change and auto-focus next input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
    index: number,
  ) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 1) {
      field.handleChange(value)

      // Auto-focus next input if value is entered
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  // Handle backspace to focus previous input
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace' && index > 0) {
      const currentValue = (e.target as HTMLInputElement).value
      if (!currentValue) {
        const prevInput = document.getElementById(`code-input-${index - 1}`)
        prevInput?.focus()
      }
    }
  }

  // Handle paste functionality
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    fieldArray: any,
  ) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

    if (digits.length === 6) {
      fieldArray.forEach((field: any, index: number) => {
        field.handleChange(digits[index] || '')
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedEase</h1>
          <p className="text-gray-600">Medical Management System</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            Secure Verification
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Verify Your Identity
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter the 6-digit code sent to your email
          </p>
          <p className="text-gray-700 font-medium text-center mb-8">{email}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Subscribe selector={(state) => state.values.code}>
              {(code) => (
                <div className="flex justify-center gap-2 mb-6">
                  {code.map((_: string, index: number) => (
                    <form.Field key={index} name={`code[${index}]`}>
                      {(field) => (
                        <input
                          id={`code-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={field.state.value}
                          onChange={(e) => handleInputChange(e, field, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={(e) => handlePaste(e, code)}
                          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                          disabled={form.state.isSubmitting}
                        />
                      )}
                    </form.Field>
                  ))}
                </div>
              )}
            </form.Subscribe>

            {/* Timer and Resend */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Code expires in{' '}
                <span className="font-semibold text-blue-600">3:45</span>
              </p>
              <button
                type="button"
                onClick={onResend}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                Didn't receive the code? Resend Code
              </button>
            </div>

            {/* Submit Button */}
            <form.Subscribe selector={(state) => state.values.code}>
              {(code) => {
                const isComplete = code.every((digit: string) => digit !== '')
                return (
                  <button
                    type="submit"
                    disabled={!isComplete || form.state.isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-4"
                  >
                    {form.state.isSubmitting ? 'Verifying...' : 'Verify Code'}
                  </button>
                )
              }}
            </form.Subscribe>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Back to Login
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              HIPAA Compliant
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure Medical Data
            </span>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default OtpVerificationForm
