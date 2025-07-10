import { Link } from '@tanstack/react-router'
import React from 'react'

export interface sideNavItemProps {
  label: string
  icon: React.ReactNode
  url: string
}

const SideNavigation = ({
  navItems,
}: {
  navItems: Array<sideNavItemProps>
}) => {
  return (
    <div className="h-screen bg-white/20 shadow-lg w-64">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">MedEase</h1>
            <p className="text-sm text-gray-500">Patient Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.url}
              activeProps={{
                className: 'bg-indigo-500 text-white shadow-sm',
              }}
              className="block rounded-lg transition-colors duration-200 text-nowrap"
            >
              <div className="flex items-center gap-3 p-3 hover:bg-indigo-400 hover:text-white rounded-lg group">
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
    </div>
  )
}

export default SideNavigation
