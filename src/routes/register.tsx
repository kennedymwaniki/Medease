import { createFileRoute } from '@tanstack/react-router'
import RegistrationForm from '@/components/forms/RegistrationForm'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <RegistrationForm />
    </div>
  )
}
