import SideNavigation from '@/components/SideNavigation'
// import { SidebarGroupContent } from '@/components/ui/sidebar'
import { IconCapsule } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarCheck2Icon, FileChartColumn, LucideHouse } from 'lucide-react'

export const Route = createFileRoute('/services')({
  component: RouteComponent,
})

const navItems = [
  {
    label: 'DashBoard',
    icon: <LucideHouse />,
    url: '/admin',
  },
  {
    label: 'My appointments',
    icon: <CalendarCheck2Icon />,
    url: '/appointments',
  },
  {
    label: 'My Prescription',
    icon: <IconCapsule />,
    url: '/prescriptions',
  },
  {
    label: 'My Medical History',
    icon: <FileChartColumn />,
    url: '/medical-history',
  },
  {
    label: 'Profile and settings',
    icon: <IconCapsule />,
    url: '/settings',
  },
  {
    label: 'doctors',
    icon: <IconCapsule />,
    url: '/settings',
  },
]
function RouteComponent() {
  return (
    <div>
      <div>
        <SideNavigation navItems={navItems} />
      </div>
    </div>
  )
}
