import { Outlet, createFileRoute } from '@tanstack/react-router'
import {
  FaBell,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaCreditCard,
  FaFileAlt,
  FaHome,
  FaPills,
  FaPrescriptionBottleAlt,
  FaUserCog,
  FaUserMd,
  FaUsers,
} from 'react-icons/fa'
import AdminSideNavigation from '@/components/AdminSideNavigation'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const navItems = [
    { label: 'Dashboard', url: '/admin/', icon: <FaHome />, category: 'main' },

    // User Management
    {
      label: 'Doctors',
      url: '/admin/doctors',
      icon: <FaUserMd />,
      category: 'User Management',
    },
    {
      label: 'Patients',
      url: '/admin/patients',
      icon: <FaUsers />,
      category: 'User Management',
    },
    {
      label: 'System Users',
      url: '/admin/users',
      icon: <FaUserCog />,
      category: 'User Management',
    },

    // Operations
    {
      label: 'Appointments',
      url: '/admin/appointments',
      icon: <FaCalendarAlt />,
      category: 'Operations',
    },
    {
      label: 'Medications',
      url: '/admin/medications',
      icon: <FaPills />,
      category: 'Operations',
    },
    {
      label: 'Prescriptions',
      url: '/admin/prescriptions',
      icon: <FaPrescriptionBottleAlt />,
      category: 'Operations',
    },
    {
      label: 'Medical Records',
      url: '/admin/medical-records',
      icon: <FaFileAlt />,
      category: 'Operations',
    },
    {
      label: 'Payments',
      url: '/admin/payments',
      icon: <FaCreditCard />,
      category: 'Operations',
    },
    {
      label: 'Reports',
      url: '/admin/reports',
      icon: <FaChartBar />,
      category: 'Operations',
    },

    // System
    {
      label: 'Notifications',
      url: '/admin/notifications',
      icon: <FaBell />,
      category: 'System',
    },
    {
      label: 'Settings',
      url: '/admin/settings',
      icon: <FaCog />,
      category: 'System',
    },
  ]

  return (
    <div className="flex">
      <div>
        <AdminSideNavigation navItems={navItems} />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
