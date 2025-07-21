/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Link } from '@tanstack/react-router'
import React from 'react'
import { LogOut } from 'lucide-react'
import { useLogout } from '@/hooks/useAuth'

export interface adminNavItemProps {
  label: string
  icon: React.ReactNode
  url: string
  category: string
}

const AdminSideNavigation = ({
  navItems,
}: {
  navItems: Array<adminNavItemProps>
}) => {
  // Group items by category
  const groupedItems = navItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, adminNavItemProps[]>,
  )

  const logout = useLogout()
  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="h-screen bg-white shadow-lg overflow-y-auto w-64 flex flex-col">
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10  rounded-lg flex items-center justify-center">
            <img
              src="/public/Medease-logo.png"
              alt="MedEase Logo"
              className="w-8 h-8 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">MedEase</h1>
            <p className="text-sm text-gray-500">Healthcare Management</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {/* Dashboard - no category header */}
              {category === 'main' ? null : (
                <div className="px-3 py-2 mt-6 first:mt-0">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {category}
                  </h3>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.url}
                    activeProps={{
                      className: 'bg-indigo-500 text-white shadow-sm',
                    }}
                    activeOptions={{
                      exact: item.url === '/admin/' ? true : false,
                    }}
                    className="block rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-1 p-3 hover:bg-indigo-400 hover:text-white rounded-lg group">
                      <span className="text-gray-600 group-hover:text-white w-5 h-5 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="font-medium text-gray-700 group-hover:text-white">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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

export default AdminSideNavigation
