// import OtpVerificationForm from '@/components/forms/OtpVerificationForm'
import { createFileRoute } from '@tanstack/react-router'
import OtpVerificationForm2 from '@/components/forms/OtpVerificationForm2'

export const Route = createFileRoute('/otp-verification')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <OtpVerificationForm2 />
      {/* <OtpVerificationForm
        email="k****@gmail.com"
        onSubmit={(code) => console.log('Verification code:', code)}
        onResend={() => console.log('Resend code')}
        onBack={() => console.log('Back to login')}
      /> */}
    </div>
  )
}
