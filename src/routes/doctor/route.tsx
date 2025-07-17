import { Outlet, createFileRoute } from '@tanstack/react-router'
import {
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaFileAlt,
  FaPills,
  FaPrescriptionBottleAlt,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'
import SideNavigation from '@/components/SideNavigation'
import DoctorSideNavigation from '@/components/Doctors/DoctorSideNavigation'

export const Route = createFileRoute('/doctor')({
  component: RouteComponent,
})

function RouteComponent() {
  const navItems = [
    { label: 'Dashboard', url: '/doctor/', icon: <FaChartBar /> },
    {
      label: 'Patients',
      url: '/doctor/patients',
      icon: <FaUsers />,
    },
    // appointments
    {
      label: 'Appointments',
      url: '/doctor/appointments',
      icon: <FaCalendarAlt />,
    },
    {
      label: 'Prescriptions',
      url: '/doctor/prescriptions',
      icon: <FaPrescriptionBottleAlt />,
    },
    // {
    //   label: 'Medical History',
    //   url: '/doctor/medical-history',
    //   icon: <FaFileAlt />,
    // },
    // {
    //   label: 'Medications',
    //   url: '/doctor/medications',
    //   icon: <FaPills />,
    // },
    {
      label: 'Settings',
      url: '/doctor/settings',
      icon: <FaCog />,
    },
    // profile
    {
      label: 'Profile',
      url: '/doctor/profile',
      icon: <FaUserCircle />,
    },
  ]

  return (
    <div className="flex">
      <DoctorSideNavigation navItems={navItems} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
