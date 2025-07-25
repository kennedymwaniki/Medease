import { Link } from '@tanstack/react-router'
import React from 'react'
import { LogOut } from 'lucide-react'
import { useLogout } from '@/hooks/useAuth'

export interface sideNavItemProps {
  label: string
  icon: React.ReactNode
  url: string
}

const DoctorSideNavigation = ({
  navItems,
}: {
  navItems: Array<sideNavItemProps>
}) => {
  const logout = useLogout()
  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="h-screen bg-white shadow-sm w-64 flex flex-col border-r border-gray-100">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img
              src="/public/Medease-logo.png"
              alt="MedEase Logo"
              className="w-8 h-8"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">MedEase</h1>
            <p className="text-sm text-gray-500">Doctor Portal</p>
          </div>
        </div>

        <nav className="space-y-1 text-nowrap">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.url}
              activeProps={{
                className: 'text-blue-600 bg-gray-100',
              }}
              activeOptions={{
                exact: item.url === '/doctor/' ? true : false,
              }}
              className="block rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 hover:text-blue-600 rounded-lg group">
                <span className="group-hover:text-blue-600 text-lg">
                  {item.icon}
                </span>
                <span className="font-medium group-hover:text-blue-600">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default DoctorSideNavigation
