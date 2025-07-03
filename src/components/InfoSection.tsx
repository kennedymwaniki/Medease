import React from 'react'

const InfoSection = () => {
  const infoCards = [
    {
      title: 'Highly Qualified Doctors',
      description:
        'Our team of certified and experienced doctors ensures the best care tailored to your needs.',
      bgImage:
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      gradient: 'from-green-600/30 to-teal-600/20',
    },
    {
      title: 'Emergency Services',
      description:
        'Round-the-clock emergency care available for urgent medical situations, ensuring immediate attention when it matters most.',
      bgImage:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      gradient: 'from-red-600/30 to-pink-600/80',
    },
    {
      title: 'Modern Medical Equipment',
      description:
        'Our team of certified and experienced doctors ensures the best care tailored to your needs.',
      bgImage:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      gradient: 'from-blue-600/30 to-cyan-600/30',
    },
    {
      title: '24/7 Ambulance Services',
      description:
        'Swift and reliable ambulance services equipped with advanced life-support systems, ensuring timely.',
      bgImage:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      gradient: 'from-orange-600/20 to-yellow-600/30',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${card.bgImage})`,
                }}
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${card.gradient} group-hover:opacity-50 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <div className="text-white space-y-3">
                  <h3 className="text-xl font-bold leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InfoSection
