import { createFileRoute } from '@tanstack/react-router'
import PatientStatCard from '@/components/patient/PatientStatCards'
import PatientPrescriptions from '@/components/patient/PatientPrescriptions'
import UpcomingAppointments from '@/components/patient/UpcomingAppointments'

export const Route = createFileRoute('/patient/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 max-w-8xl mx-auto bg-slate-100 p-4">
      <PatientStatCard />
      <div className="flex mt-6">
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
