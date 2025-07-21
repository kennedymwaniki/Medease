import { createFileRoute } from '@tanstack/react-router'
import AdminStatCard from '@/components/admincomponents/AdminStatCard'
// import QuickActionsComponents from '@/components/QuickActionsComponents'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <AdminStatCard />
    </div>
  )
}
