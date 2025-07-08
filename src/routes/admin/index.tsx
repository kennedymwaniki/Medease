import { createFileRoute } from '@tanstack/react-router'
import StatCard from '@/components/StatCard'
import QuickActionsComponents from '@/components/QuickActionsComponents'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <StatCard />
      <QuickActionsComponents />
    </div>
  )
}
