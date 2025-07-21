import { createFileRoute } from '@tanstack/react-router'

import HeroSection from '@/components/HeroSection'
import InfoSection from '@/components/InfoSection'
import DepartmentsSection from '@/components/DepartmentSection'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import HealthcareComponent from '@/components/HealthcareComponent'
import { Marquee } from '@/components/magicui/marquee'
import { MarqueeDemo } from '@/components/magicui/MarqueeDemo'

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
