import React from 'react'

const DepartmentsSection = () => {
  const departments = [
    {
      title: 'Cardiology',
      description:
        'Expert heart care from routine check-ups to advanced cardiac treatments.',
      bgImage: 'public/cardiology.png',
      size: 'large',
    },
    {
      title: 'Orthopedics',
      description:
        'Comprehensive bone and joint care to keep you moving pain-free.',
      bgImage:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      size: 'small',
    },
    {
      title: 'Neurology',
      description:
        'Advanced care for brain, spine, and nervous system conditions.',
      bgImage: '/public/neurology-image.png',
      size: 'center',
    },
    {
      title: 'Dermatology',
      description:
        'Offering specialized skin care treatments for all age groups, ensuring healthy.',
      bgImage:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      size: 'small',
    },
    {
      title: 'Gynecology & Obstetrics',
      description:
        "Comprehensive women's health services and expert maternity care.",
      bgImage:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      size: 'small',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Dedicated Departments Providing
            <br />
            Exceptional Care
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bringing Together Expertise and Innovation to Provide Specialized
            <br />
            Care for Every Patient's Needs.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
          {/* Cardiology - Large card */}
          <div className="lg:col-span-4 lg:row-span-2 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group min-h-[300px] lg:min-h-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${departments[0].bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="text-white space-y-4">
                <h3 className="text-2xl font-bold">{departments[0].title}</h3>
                <p className="text-white/90 text-base leading-relaxed">
                  {departments[0].description}
                </p>
              </div>

              <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
            </div>
          </div>

          {/* Orthopedics - Small card */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group min-h-[250px]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${departments[1].bgImage})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="text-white space-y-3">
                <h3 className="text-xl font-bold">{departments[1].title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {departments[1].description}
                </p>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
            </div>
          </div>

          {/* Dermatology - Small card */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group min-h-[250px]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${departments[3].bgImage})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="text-white space-y-3">
                <h3 className="text-xl font-bold">{departments[3].title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {departments[3].description}
                </p>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
            </div>
          </div>

          {/* Neurology - Center large card */}
          <div className="lg:col-span-4 lg:row-span-1 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group min-h-[280px]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${departments[2].bgImage})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="text-white space-y-3">
                <h3 className="text-xl font-bold">{departments[2].title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {departments[2].description}
                </p>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
            </div>
          </div>

          {/* Gynecology & Obstetrics - Small card */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group min-h-[280px]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${departments[4].bgImage})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="text-white space-y-3">
                <h3 className="text-xl font-bold">{departments[4].title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {departments[4].description}
                </p>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DepartmentsSection
