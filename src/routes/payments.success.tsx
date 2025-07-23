import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/payments/success')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const handleProceedToDashboard = () => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }

    const role = user.role.toLowerCase()
    switch (role) {
      case 'patient':
        navigate({ to: '/patient' })
        break
      case 'doctor':
        navigate({ to: '/doctor' })
        break
      case 'admin':
        navigate({ to: '/admin' })
        break
      default:
        navigate({ to: '/' })
    }
  }

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100],
        x: [0, Math.random() > 0.5 ? 50 : -50],
      }}
      transition={{
        duration: 3,
        delay: i * 0.5,
        repeat: Infinity,
        repeatDelay: 2,
      }}
      style={{
        left: `${20 + i * 12}%`,
        top: `${60 + (i % 2) * 10}%`,
      }}
    >
      <Sparkles className="w-6 h-6 text-yellow-400" />
    </motion.div>
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      {floatingElements}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="mb-6"
          >
            <div className="relative mx-auto w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20"
              />
              <div className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-600 mb-2 text-lg">
              Thank you for your payment!
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Your transaction has been processed successfully.
            </p>
          </motion.div>

          {/* Payment Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">
                Payment Confirmed
              </span>
            </div>
          </motion.div>

          {/* Proceed Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceedToDashboard}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Dashboard</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                →
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-6 text-xs text-gray-400"
          >
            <p>• Secure Payment • HIPAA Compliant • Receipt Sent via Email</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full"
      />
    </div>
  )
}
