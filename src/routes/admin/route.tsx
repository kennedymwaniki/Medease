import { Outlet, createFileRoute } from '@tanstack/react-router'
import {
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaHome,
  FaPills,
  FaPrescriptionBottleAlt,
  FaUserCog,
} from 'react-icons/fa'
import AdminSideNavigation from '@/components/AdminSideNavigation'
// import App from '@/components/App'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const navItems = [
    { label: 'Dashboard', url: '/admin/', icon: <FaHome />, category: 'main' },

    // User Management
    // {
    //   label: 'Doctors',
    //   url: '/admin/doctors',
    //   icon: <FaUserMd />,
    //   category: 'User Management',
    // },
    // {
    //   label: 'Patients',
    //   url: '/admin/patients',
    //   icon: <FaUsers />,
    //   category: 'User Management',
    // },
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
    // {
    //   label: 'Medical Records',
    //   url: '/admin/medical-records',
    //   icon: <FaFileAlt />,
    //   category: 'Operations',
    // },
    // {
    //   label: 'Payments',
    //   url: '/admin/payments',
    //   icon: <FaCreditCard />,
    //   category: 'Operations',
    // },
    {
      label: 'Reports',
      url: '/admin/reports',
      icon: <FaChartBar />,
      category: 'Operations',
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
      <div className="flex-1 bg-slate-100">
        <Outlet />
      </div>
      {/* <App /> */}
    </div>
  )
}
