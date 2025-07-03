import { createFileRoute } from '@tanstack/react-router'

import HeroSection from '@/components/HeroSection'
import InfoSection from '@/components/InfoSection'
import DepartmentsSection from '@/components/DepartmentSection'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <HeroSection />
      <InfoSection />
      <DepartmentsSection />
      <Footer />
    </div>
  )
}
