import { createFileRoute } from '@tanstack/react-router'
import DoctorPrescriptionsTable from '@/components/Doctors/DoctorPrescriptionsTable'
// import DoctorPrescriptionForm from '@/components/Doctors/DoctorPrescriptionForm'

export const Route = createFileRoute('/doctor/prescriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DoctorPrescriptionsTable />
      {/* <DoctorPrescriptionForm /> */}
    </div>
  )
}
