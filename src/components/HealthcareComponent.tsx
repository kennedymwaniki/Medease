import React from 'react'
import { ArrowRight } from 'lucide-react'

const HealthcareComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Leading Comprehensive Healthcare
            <br />
            with Compassion
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our mission is to provide exceptional medical care, focusing on
            personalized treatment and the well-being of every patient.
          </p>
        </div>

        {/* First Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Image Only */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face"
              alt="Doctor with patient"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 2 - Text Content */}
          <div className="bg-blue-100 rounded-2xl p-8 flex flex-col justify-center h-80">
            <div className="text-6xl font-bold text-blue-900 mb-4">200+</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Qualified Doctors and Nurses
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              A highly skilled team of experienced professionals, fully
              committed to your health and well-being, delivering compassionate,
              personalized care with a focus on innovative treatments, advanced
              medical practices
            </p>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors w-fit">
              Meet Our Team
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3 - Image Only */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80">
            <img
              src="public/neurology-image.png"
              alt="Medical brain scan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Second Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 4 - Text Content */}
          <div className="bg-purple-100 rounded-2xl p-8 flex flex-col justify-center h-80">
            <div className="text-6xl font-bold text-purple-900 mb-4">13+</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Centers Across the Region
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              Providing seamless access to high-quality healthcare services
              across multiple convenient locations ensuring every individual,
              regardless of their location, receives outstanding care,
              exceptional care unmatched to their well-being
            </p>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors w-fit">
              View All Locations
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 5 - Image Only */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=cro"
              alt="Medical team"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 6 - Text Content */}
          <div className="bg-yellow-100 rounded-2xl p-8 flex flex-col justify-center h-80">
            <div className="text-6xl font-bold text-yellow-900 mb-4">15+</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Healthcare Excellence Awards
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              A dedicated team of experienced professionals, committed to
              delivering exceptional care and support for your health and
              well-being, ensuring personalized treatment and comprehensive
              service every step of the way
            </p>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors w-fit">
              Our Achievements
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthcareComponent
