import React from 'react'
import { ArrowRight } from 'lucide-react'

const HealthcareComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Leading Comprehensive Healthcare
            <br className="hidden sm:block" />
            <span className="block sm:inline"> with Compassion</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our mission is to provide exceptional medical care, focusing on
            personalized treatment and the well-being of every patient.
          </p>
        </div>

        {/* First Row - 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Card 1 - Image Only */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-64 sm:h-72 lg:h-80">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face"
              alt="Doctor with patient"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 2 - Text Content */}
          <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-64 sm:h-72 lg:h-80 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-2 sm:mb-4">
                200+
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Qualified Doctors and Nurses
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-4">
                A highly skilled team of experienced professionals, fully
                committed to your health and well-being, delivering
                compassionate, personalized care with a focus on innovative
                treatments and advanced medical practices.
              </p>
            </div>
            <button className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors w-fit">
              Meet Our Team
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Card 3 - Image Only */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-64 sm:h-72 lg:h-80">
            <img
              src="/neurology-image.png"
              alt="Medical brain scan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Second Row - 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 4 - Text Content */}
          <div className="bg-purple-100 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-64 sm:h-72 lg:h-80">
            <div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-900 mb-2 sm:mb-4">
                13+
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Centers Across the Region
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-4">
                Providing seamless access to high-quality healthcare services
                across multiple convenient locations, ensuring every individual
                receives outstanding care tailored to their well-being.
              </p>
            </div>
            <button className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors w-fit">
              View All Locations
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Card 5 - Image Only */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-64 sm:h-72 lg:h-80">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"
              alt="Medical team"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 6 - Text Content */}
          <div className="bg-yellow-100 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-64 sm:h-72 lg:h-80 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-900 mb-2 sm:mb-4">
                15+
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Healthcare Excellence Awards
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-4">
                A dedicated team of experienced professionals, committed to
                delivering exceptional care and support for your health and
                well-being, ensuring personalized treatment and comprehensive
                service every step of the way.
              </p>
            </div>
            <button className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors w-fit">
              Our Achievements
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthcareComponent
