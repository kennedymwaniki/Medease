const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-8 order-2 lg:order-1 bg-white rounded-3xl p-8 shadow-xl">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Empowering
                <br />
                Wellness with
                <br />
                Advanced Care
              </h1>

              <p className="text-sm text-gray-600 max-w-lg">
                Connect with top specialists, explore personalized care, and
                experience a healthier life—all with just a few clicks.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-gray-800 font-medium py-3 px-8 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                Explore Services
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Consult Now</span>
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

            {/* Trust Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                  SM
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                  AB
                </div>
              </div>
              <div className="text-gray-700">
                <span className="font-bold text-lg">50K+</span>
                <span className="text-sm ml-1">Patients Trust Us</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image with Floating Elements */}
          <div className="relative order-1 lg:order-2 bg-white rounded-3xl p-8 shadow-xl">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Doctor with family"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Better Health
                </span>
              </div>
            </div>

            <div className="absolute top-1/2 -right-4 bg-white rounded-2xl p-4 shadow-xl border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Better Care
                </span>
              </div>
            </div>

            <div className="absolute -bottom-4 right-8 bg-white rounded-2xl p-4 shadow-xl border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Your Health, Our Priority
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/4 -left-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-60"></div>
            <div className="absolute -z-10 bottom-1/4 -right-8 w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

//   <img
//     src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
//     alt="Doctor with family"
//     className="w-full h-96 lg:h-[500px] object-cover"
//   />
