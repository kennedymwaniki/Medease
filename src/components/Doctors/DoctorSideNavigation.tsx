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
    <div className="h-screen bg-white/20 shadow-lg w-64 flex flex-col">
      <div className="p-4 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10  rounded-lg flex items-center justify-center">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
              <img
                src="/public/Medease-logo.png"
                alt="MedEase Logo"
                className="w-8 h-8"
              />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">MedEase</h1>
            <p className="text-sm text-gray-500">Doctor Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.url}
              activeProps={{
                className: 'bg-indigo-500 text-white shadow-sm',
              }}
              activeOptions={{
                exact: item.url === '/patient/' ? true : false,
              }}
              className="block rounded-lg transition-colors duration-200 text-nowrap"
            >
              <div className="flex items-center gap-3 p-3 hover:bg-indigo-300 hover:text-white rounded-lg group">
                <span className="text-gray-600 group-hover:text-white">
                  {item.icon}
                </span>
                <span className="font-medium text-gray-700 group-hover:text-white">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
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
