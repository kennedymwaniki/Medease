import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import NotificationsProvider, { Notifications } from 'react-push-notification'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* <NavBar /> */}
      <Notifications />
      <Outlet />
      {/* <TanStackRouterDevtools position="top-right" /> */}
      {/* <App /> */}
      {/* <TanStackQueryLayout /> */}
    </>
  ),
})
