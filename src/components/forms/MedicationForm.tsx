import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useCreateMedication } from '@/hooks/useMedications'

// Zod schema for medication form validation
const medicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(100, 'Medication name must be less than 100 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be less than 500 characters'),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .regex(
      /^\d+(\.\d+)?\s*(mg|ml|g|mcg|units?|tablets?|capsules?)$/i,
      'Please enter a valid dosage format (e.g., 10mg, 5ml, 2 tablets)',
    ),
  type: z
    .string()
    .min(1, 'Please select a medication type')
    .refine(
      (val) =>
        [
          'liquid',
          'tablet',
          'capsule',
          'injection',
          'topical',
          'inhaler',
          'drops',
          'powder',
        ].includes(val),
      'Please select a valid medication type',
    ),
  route: z
    .string()
    .min(1, 'Please select an administration route')
    .refine(
      (val) =>
        [
          'oral',
          'topical',
          'injection',
          'inhalation',
          'sublingual',
          'rectal',
          'nasal',
          'ophthalmic',
        ].includes(val),
      'Please select a valid administration route',
    ),
  manufacturer: z
    .string()
    .min(2, 'Manufacturer name must be at least 2 characters')
    .max(100, 'Manufacturer name must be less than 100 characters'),
  expirationDate: z
    .string()
    .min(1, 'Expiration date is required')
    .refine((date) => {
      const expDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return expDate >= today
    }, 'Expiration date must be in the future'),
})

type MedicationFormData = z.infer<typeof medicationSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function MedicationForm() {
  const { addMedication, error } = useCreateMedication()
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      dosage: '',
      type: '',
      route: '',
      manufacturer: '',
      expirationDate: '',
    } satisfies MedicationFormData,
    onSubmit: async ({ value }) => {
      // Final validation before submission
      const result = medicationSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      await addMedication(value)
      if (error) {
        console.error('Error creating medication:', error)
      } else {
        console.log('Medication created successfully:', value)
      }
      form.reset()
    },
  })

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Medication Registration Form
      </h2>

      <div className="space-y-4">
        {/* Name Field */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              validateField(value, medicationSchema.shape.name),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.name),
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medication Name
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
                placeholder="Enter medication name"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />

        {/* Description Field */}
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              validateField(value, medicationSchema.shape.description),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.description),
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
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
                placeholder="Enter medication description"
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
              validateField(value, medicationSchema.shape.dosage),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.dosage),
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

        {/* Type Field */}
        <form.Field
          name="type"
          validators={{
            onChange: ({ value }) =>
              validateField(value, medicationSchema.shape.type),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.type),
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medication Type
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
                <option value="">Select medication type</option>
                <option value="liquid">Liquid</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="injection">Injection</option>
                <option value="topical">Topical</option>
                <option value="inhaler">Inhaler</option>
                <option value="drops">Drops</option>
                <option value="powder">Powder</option>
              </select>
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />

        {/* Route Field */}
        <form.Field
          name="route"
          validators={{
            onChange: ({ value }) =>
              validateField(value, medicationSchema.shape.route),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.route),
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Administration Route
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
                <option value="">Select administration route</option>
                <option value="oral">Oral</option>
                <option value="topical">Topical</option>
                <option value="injection">Injection</option>
                <option value="inhalation">Inhalation</option>
                <option value="sublingual">Sublingual</option>
                <option value="rectal">Rectal</option>
                <option value="nasal">Nasal</option>
                <option value="ophthalmic">Ophthalmic</option>
              </select>
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />

        {/* Manufacturer Field */}
        <form.Field
          name="manufacturer"
          validators={{
            onChange: ({ value }) =>
              validateField(value, medicationSchema.shape.manufacturer),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.manufacturer),
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Manufacturer
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
                placeholder="Enter manufacturer name"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />

        {/* Expiration Date Field */}
        <form.Field
          name="expirationDate"
          validators={{
            onChange: ({ value }) =>
              validateField(value, medicationSchema.shape.expirationDate),
            onBlur: ({ value }) =>
              validateField(value, medicationSchema.shape.expirationDate),
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiration Date
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
                {isSubmitting ? 'Submitting...' : 'Register Medication'}
              </button>
            )}
          />
        </div>
      </div>

      {/* Debug Information */}
      <form.Subscribe
        selector={(state) => state.values}
        children={(values) => (
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-medium mb-2">Form Data (Debug)</h3>
            <pre className="text-xs overflow-auto max-h-40 text-gray-600">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
      />

      {/* Form State Debug */}
      <form.Subscribe
        selector={(state) => [state.isValid, state.canSubmit]}
        children={([isValid, canSubmit]) => (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Form State</h3>
            <p className="text-xs text-gray-600">
              Valid: {isValid ? 'Yes' : 'No'}
            </p>
            <p className="text-xs text-gray-600">
              Can Submit: {canSubmit ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      />
    </div>
  )
}

export default MedicationForm
