const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Content Section */}
          <div className="space-y-8 order-2 lg:order-1 flex flex-col justify-center">
            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Empowering
                <br />
                Wellness with
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Advanced Care
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                Connect with top specialists, explore personalized care, and
                experience a healthier life—all with just a few clicks.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-gray-800 font-medium py-4 px-8 rounded-full border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Services
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Consult Now</span>
                <svg
                  className="w-5 h-5"
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
            <div className="flex items-center space-x-6">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-4 border-white shadow-lg">
                  JD
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm border-4 border-white shadow-lg">
                  SM
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm border-4 border-white shadow-lg">
                  AB
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs border-4 border-white shadow-lg">
                  +2K
                </div>
              </div>
              <div className="text-gray-700">
                <div className="font-bold text-2xl lg:text-3xl">50K+</div>
                <div className="text-sm lg:text-base text-gray-500">
                  Patients Trust Us
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white ">
                <img
                  src="/HeroImage.png"
                  alt="Doctor with family - Better Health, Better Care"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover rounded-2xl"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -z-10 bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-60 animate-pulse delay-700"></div>
              <div className="absolute -z-10 top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-40 animate-bounce"></div>

              {/* Floating Elements */}
              {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Online
                  </span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg animate-float delay-500">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">4.9</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
