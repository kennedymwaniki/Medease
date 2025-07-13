import { createFileRoute } from '@tanstack/react-router'
import PatientStatCard from '@/components/patient/PatientStatCards'
import PatientPrescriptions from '@/components/patient/PatientPrescriptions'
import UpcomingAppointments from '@/components/patient/UpcomingAppointments'

export const Route = createFileRoute('/patient/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col max-w-8xl mx-auto">
      <PatientStatCard />
      <div className="flex gap-6 mt-6">
        <div className="flex-1">
          <PatientPrescriptions />
        </div>
        <div className="flex-1">
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  )
}
