import { createFileRoute } from '@tanstack/react-router'
import UsersTable from '@/components/users/UsersTable'

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <p>Hello users</p>
      {/* <UsersTable /> */}
    </div>
  )
}
