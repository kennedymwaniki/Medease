// public/sw.js
const CACHE_NAME = 'medease-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event')
  self.skipWaiting()
})

// Activate eve
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event')
  event.waitUntil(self.clients.claim())
})

// Push event - handles incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received', event)

  let notificationData

  try {
    notificationData = event.data ? event.data.json() : {}
  } catch (error) {
    console.error('Error parsing push data:', error)
    notificationData = {
      title: 'MedEase Notification',
      body: 'You have a new notification',
    }
  }

  const {
    title = 'MedEase',
    body = 'You have a new notification',
    icon = '/assets/icons/notification-icon.png',
    badge = '/assets/icons/badge-icon.png',
    data = {},
    actions = [],
  } = notificationData

  const notificationOptions = {
    body,
    icon,
    badge,
    data,
    actions,
    requireInteraction: true, // Keep notification visible until user interacts
    timestamp: Date.now(),
    tag: data.type || 'general', // Prevent duplicate notifications
    renotify: true,
    vibrate: [200, 100, 200], // Vibration pattern for mobile
  }

  event.waitUntil(
    self.registration.showNotification(title, notificationOptions),
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click event', event)

  const { notification } = event
  const { data, actions } = notification

  notification.close()

  // Handle action clicks
  if (event.action) {
    switch (event.action) {
      case 'view':
        event.waitUntil(handleViewAction(data))
        break
      case 'dismiss':
        // Just close the notification (already closed above)
        break
      default:
        event.waitUntil(handleDefaultAction(data))
        break
    }
  } else {
    // Handle notification body click
    event.waitUntil(handleDefaultAction(data))
  }
})

// Handle view action
async function handleViewAction(data) {
  const { type, appointmentId } = data

  let url = '/'

  switch (type) {
    case 'appointment':
      url = `/doctor/appointments`
      break
    default:
      url = '/'
  }

  return focusOrOpenWindow(url)
}

// Handle default action (notification body click)
async function handleDefaultAction(data) {
  return focusOrOpenWindow('/')
}

// Focus existing window or open new one
async function focusOrOpenWindow(url) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })

  // Check if there's already a window/tab open with the target URL
  for (const client of clients) {
    if (client.url.includes(url) && 'focus' in client) {
      return client.focus()
    }
  }

  // Check if there's any window/tab open for the app
  for (const client of clients) {
    if (client.url.includes(self.location.origin) && 'focus' in client) {
      client.focus()
      return client.navigate(url)
    }
  }

  // No existing window found, open a new one
  if (self.clients.openWindow) {
    return self.clients.openWindow(url)
  }
}

// Background sync event (optional - for offline support)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event', event)

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle any background sync tasks here
  console.log('Performing background sync...')
}
