import { createFileRoute } from '@tanstack/react-router'
import addNotification from 'react-push-notification'

export const Route = createFileRoute('/page')({
  component: RouteComponent,
})

function RouteComponent() {
  const buttonClick = () => {
    console.log('Button clicked') // Debug log
    try {
      addNotification({
        title: 'Warning',
        subtitle: 'This is a subtitle',
        message: 'This is a very long message',
        theme: 'red',
        native: true,
        duration: 5000, // Duration in milliseconds
      })
      console.log('Notification sent') // Debug log
    } catch (error) {
      console.error('Notification error:', error)
    }
  }

  return (
    <div className="page">
      <button
        type="button" // Add explicit type
        onClick={buttonClick}
        className="button bg-amber-400 mt-8 p-4 rounded-lg hover:bg-amber-500 transition-colors cursor-pointer"
      >
        Hello world.
      </button>
    </div>
  )
}
