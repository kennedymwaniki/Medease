import { Outlet, createFileRoute } from '@tanstack/react-router'
import {
  FaCalendarAlt,
  FaCreditCard,
  FaFileAlt,
  FaHome,
  FaPrescriptionBottleAlt,
  FaUser,
} from 'react-icons/fa'
// import { IconRobotFace } from '@tabler/icons-react'
import SideNavigation from '@/components/SideNavigation'

export const Route = createFileRoute('/patient')({
  component: RouteComponent,
})

function RouteComponent() {
  const navItems = [
    { label: 'Dashboard', url: '/patient/', icon: <FaHome /> },
    {
      label: 'My Appointments',
      url: '/patient/appointments',
      icon: <FaCalendarAlt />,
    },
    {
      label: 'My Prescriptions',
      url: '/patient/prescriptions',
      icon: <FaPrescriptionBottleAlt />,
    },
    {
      label: 'Medical History',
      url: '/patient/medical-history',
      icon: <FaFileAlt />,
    },
    // {
    //   label: 'Find Doctors',
    //   url: '/patient/doctors',
    //   icon: <FaUserMd />,
    // },
    {
      label: 'Payments & Billing',
      url: '/patient/payments',
      icon: <FaCreditCard />,
    },
    {
      label: 'Chat',
      url: '/patient/chat',
      icon: <FaUser />,
    },
    {
      label: 'Profile Settings',
      url: '/patient/profile',
      icon: <FaUser />,
    },

    // {
    //   label: 'Help & Support',
    //   url: '/patient/help',
    //   icon: <FaQuestionCircle />,
    // },
  ]

  return (
    <div className="flex">
      <SideNavigation navItems={navItems} />
      <div className="flex-1 gap-8 max-w-9xl p-8 bg-slate-50 mx-auto">
        <Outlet />
      </div>
    </div>
  )
}
