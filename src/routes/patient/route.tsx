import { Outlet, createFileRoute } from '@tanstack/react-router'
import {
  FaCalendarAlt,
  FaCreditCard,
  FaFileAlt,
  FaHome,
  FaPrescriptionBottleAlt,
  FaQuestionCircle,
  FaUser,
  FaUserMd,
} from 'react-icons/fa'
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
    // {
    //   label: 'Payments & Billing',
    //   url: '/patient/payments',
    //   icon: <FaCreditCard />,
    // },
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
      <div className="flex-1 p-8 max-w-9xl mx-auto">
        <Outlet />
      </div>
    </div>
  )
}
