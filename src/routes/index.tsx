import { createFileRoute } from '@tanstack/react-router'

import DepartmentsSection from '@/components/DepartmentSection'
import Footer from '@/components/Footer'
import HealthcareComponent from '@/components/HealthcareComponent'
import HeroSection from '@/components/HeroSection'
import InfoSection from '@/components/InfoSection'
import { MarqueeDemo } from '@/components/magicui/MarqueeDemo'
import NavBar from '@/components/NavBar'
import FAQSection from '@/components/FAQSection'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="">
      <NavBar />
      <HeroSection />
      <InfoSection />
      <DepartmentsSection />
      <HealthcareComponent />
      <FAQSection />
      <MarqueeDemo />
      <Footer />
    </div>
  )
}
