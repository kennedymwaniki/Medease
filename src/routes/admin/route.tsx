import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col h-full">
      <div>Navbar</div>

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

// import { AppSidebar } from '@/components/app-sidebar'
// import { SiteHeader } from '@/components/site-header'
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
// import { createFileRoute, Outlet } from '@tanstack/react-router'

// // import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

// export const Route = createFileRoute('/admin')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return (
//     <SidebarProvider
//       style={
//         {
//           '--sidebar-width': 'calc(var(--spacing) * 72)',
//           '--header-height': 'calc(var(--spacing) * 12)',
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <Outlet />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
