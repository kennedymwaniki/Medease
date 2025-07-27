import { createFileRoute } from '@tanstack/react-router'
import PasswordResetForm from '@/components/patient/forms/PasswordResetForm'

export const Route = createFileRoute('/password-reset')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PasswordResetForm />
    </div>
  )
}
