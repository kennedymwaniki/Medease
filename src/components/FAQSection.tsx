import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqData = [
    {
      question: 'How do I book an appointment online?',
      answer:
        "You can easily book an appointment through our website in just a few simple steps. Click the 'Book Appointment' button, complete the form with your details, select your preferred date and time, and our team will confirm your appointment promptly. It's fast, convenient, and designed to fit your schedule seamlessly.",
    },
    {
      question: 'What services does your medical center offer?',
      answer:
        "Our comprehensive medical center offers a wide range of services including primary care, specialist consultations, diagnostic imaging (X-rays, MRI, CT scans), laboratory services, preventive care, chronic disease management, women's health services, pediatric care, mental health support, and emergency care. We also provide telemedicine consultations for your convenience.",
    },
    {
      question: 'What should I bring to my first appointment?',
      answer:
        'For your first visit, please bring a valid photo ID, your insurance card, a list of current medications (including dosages), any relevant medical records or test results from previous providers, a list of allergies, and your medical history questionnaire (if completed online). Arriving 15 minutes early will help ensure a smooth check-in process.',
    },
    {
      question: 'Do you accept insurance, and which providers?',
      answer:
        'Yes, we accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare, and Medicaid. We also offer self-pay options and flexible payment plans. We recommend calling our office to verify your specific plan coverage and benefits before your appointment to avoid any surprises.',
    },
    {
      question: 'Can I reschedule or cancel my appointment?',
      answer:
        'Absolutely! You can reschedule or cancel your appointment up to 24 hours in advance through our online patient portal, by calling our office directly, or using our mobile app. We ask for at least 24 hours notice to avoid cancellation fees and to allow other patients the opportunity to schedule during that time slot.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our FAQs to find quick solutions and information
            <br className="hidden sm:block" />
            about our services, appointments, and more.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 sm:space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-left flex items-center justify-between hover:bg-white/50 transition-colors duration-200 "
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 pr-4 leading-tight">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-200" />
                  )}
                </div>
              </button>

              {/* Answer Content */}
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 border-t border-gray-200">
                  <div className="pt-4 sm:pt-6">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Contact Support
            </button>
            <button className="bg-white/80 backdrop-blur-sm text-gray-800 font-medium py-3 px-8 rounded-full border border-gray-300 hover:bg-white hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
