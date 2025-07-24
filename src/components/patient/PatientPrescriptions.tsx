import { usePatient } from '@/hooks/usePatients'
import { useAuthStore } from '@/store/authStore'

export interface Prescription {
  id: number
  frequency: string
  medicationName: string
  dosage: string
  status: 'active' | 'inactive' | 'discontinued'
  startDate: string
  endDate: string
}

const PatientPrescriptions = () => {
  const user = useAuthStore((state) => state.user)

  console.log('User from auth store:', user)
  const patientId = Number(user?.patient?.id)
  const { data: patientData, isLoading, error } = usePatient(patientId)

  if (isLoading) {
    return (
      <div className="p-4 text-blue-600">Loading patient prescriptions...</div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading patient prescriptions: {error.message}
      </div>
    )
  }

  const prescriptions = patientData?.prescriptions || []

  // Group prescriptions by status
  //  const activePrescriptions = prescriptions.filter((p) => p.status === 'active')
  const lowStockPrescriptions = prescriptions.filter((p) => {
    // For demonstration, we'll consider prescriptions with less than 10 days remaining as low stock
    const endDate = new Date(p.endDate)
    const today = new Date()
    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysRemaining <= 10 && p.status === 'active'
  })

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Active Prescriptions
        </h2>
        <p className="text-gray-600">Manage all your current medications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.map((prescription) => {
          const isLowStock = lowStockPrescriptions.some(
            (p) => p.id === prescription.id,
          )

          return (
            <div
              key={prescription.id}
              className={`relative rounded-lg border-2 p-4 transition-all duration-200 ${
                prescription.status === 'active'
                  ? isLowStock
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              {/* Status indicator */}
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    prescription.status === 'active'
                      ? isLowStock
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {prescription.status === 'active' && isLowStock
                    ? 'Low Stock'
                    : prescription.status}
                </span>
              </div>

              {/* Medication name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">
                {prescription.medicationName}
              </h3>

              {/* Dosage and frequency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dosage:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {prescription.dosage}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Frequency:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {prescription.frequency}
                  </span>
                </div>

                {/* Remaining pills (calculated based on end date) */}
                {prescription.status === 'active' && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Remaining:</span>
                    <span
                      className={`text-sm font-medium ${
                        isLowStock ? 'text-orange-700' : 'text-gray-900'
                      }`}
                    >
                      {(() => {
                        const endDate = new Date(prescription.endDate)
                        const today = new Date()
                        const daysRemaining = Math.ceil(
                          (endDate.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                        const pillsPerDay = prescription.frequency
                          .toLowerCase()
                          .includes('twice')
                          ? 2
                          : 1
                        const totalPills = Math.max(
                          0,
                          daysRemaining * pillsPerDay,
                        )
                        return `${totalPills} pills`
                      })()}
                    </span>
                  </div>
                )}
              </div>

              {/* Date range */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  <div>
                    Started:{' '}
                    {new Date(prescription.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    Ends: {new Date(prescription.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {prescriptions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No prescriptions found for this patient.
        </div>
      )}
    </div>
  )
}

export default PatientPrescriptions
