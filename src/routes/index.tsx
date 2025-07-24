import { createFileRoute } from '@tanstack/react-router'

import DepartmentsSection from '@/components/DepartmentSection'
import Footer from '@/components/Footer'
import HealthcareComponent from '@/components/HealthcareComponent'
import HeroSection from '@/components/HeroSection'
import InfoSection from '@/components/InfoSection'
import { MarqueeDemo } from '@/components/magicui/MarqueeDemo'
import NavBar from '@/components/NavBar'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <NavBar />
      <HeroSection />
      <InfoSection />
      <DepartmentsSection />
      <HealthcareComponent />
      <MarqueeDemo />
      <Footer />
    </div>
  )
}
