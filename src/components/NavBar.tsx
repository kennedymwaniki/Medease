import { Link } from '@tanstack/react-router'

const NavBar = () => {
  return (
    <nav className="bg-slate-200 shadow-sm border-b border-gray-100 mx-auto max-w-8xl rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-800 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="text-2xl font-semibold text-gray-800">
                MedEase
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-purple-600 hover:text-purple-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                to="/services"
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Services
              </Link>

              <Link
                to="/doctors"
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Doctors
              </Link>
              <Link
                to="/programs"
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Programs
              </Link>
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Book Appointment Button */}
          <div className="items-center hidden md:block">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-6 rounded-full text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>Book Appointment</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 p-2 rounded-md">
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
