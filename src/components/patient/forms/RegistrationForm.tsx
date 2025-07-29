import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useRegister } from '@/hooks/useAuth'

const baseRegistrationSchema = z.object({
  firstname: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes',
    ),
  lastname: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes',
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z
    .string()
    .min(1, 'Please select a role')
    .refine(
      (val) => ['admin', 'patient', 'doctor', 'pharmacist'].includes(val),
      'Please select a valid role',
    ),
})

// Full schema with refinement for password confirmation
const registrationSchema = baseRegistrationSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  },
)

type RegistrationFormData = z.infer<typeof registrationSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function RegistrationForm() {
  const { mutateAsync: registerUser } = useRegister()
  const form = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    } satisfies RegistrationFormData,
    onSubmit: async ({ value }) => {
      // Final validation before submission
      const result = registrationSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      console.log('Form submitted with values:', value)

      // Remove confirmPassword from the data sent to the server
      const { confirmPassword, ...userData } = value
      await registerUser(userData)
      // if (error) {
      //   console.error('Error creating user:', error)
      // } else {
      //   console.log('User registered successfully:', userData)
      // }
      form.reset()
    },
  })

  return (
    <div className="max-w-2xl mx-auto p-6 ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        User Registration
      </h2>

      <div className="space-y-4">
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="firstname"
            validators={{
              onChange: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.firstname),
              onBlur: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.firstname),
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
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
                  placeholder="Enter your first name"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="lastname"
            validators={{
              onChange: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.lastname),
              onBlur: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.lastname),
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
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
                  placeholder="Enter your last name"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Email and Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.email),
              onBlur: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.email),
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
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
                  placeholder="Enter your email address"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.password),
              onBlur: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.password),
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
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
                  placeholder="Enter your password"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must contain 8+ chars with uppercase, lowercase, number, and
                  special character
                </p>
              </div>
            )}
          />
        </div>

        {/* Confirm Password and Role Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue('password')
                if (value !== password) {
                  return "Passwords don't match"
                }
                return validateField(
                  value,
                  baseRegistrationSchema.shape.confirmPassword,
                )
              },
              onBlur: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue('password')
                if (value !== password) {
                  return "Passwords don't match"
                }
                return validateField(
                  value,
                  baseRegistrationSchema.shape.confirmPassword,
                )
              },
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
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
                  placeholder="Confirm your password"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.role),
              onBlur: ({ value }) =>
                validateField(value, baseRegistrationSchema.shape.role),
            }}
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
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
                  <option value="">Select your role</option>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
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
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm
