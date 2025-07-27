// src/services/pushNotificationService.ts
import api from '@/apis/axios'

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

class PushNotificationService {
  private vapidPublicKey: string | null = null
  private registration: ServiceWorkerRegistration | null = null

  // Convert VAPID key from base64 to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Get VAPID public key from server
  async getVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) {
      return this.vapidPublicKey
    }

    try {
      const response = await api.get('/push-notifications/vapid-public-key')
      this.vapidPublicKey = response.data.publicKey
      console.log('VAPID public key fetched:', this.vapidPublicKey)
      return this.vapidPublicKey!
    } catch (error) {
      console.error('Error fetching VAPID public key:', error)
      throw error
    }
  }

  // Check if push notifications are supported
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  // Register service worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported')
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service worker registered:', this.registration)
      return this.registration
    } catch (error) {
      console.error('Service worker registration failed:', error)
      throw error
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported')
    }

    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)
    return permission
  }

  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    try {
      // Ensure service worker is registered
      if (!this.registration) {
        this.registration = await this.registerServiceWorker()
      }

      // Request permission
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        console.log('Push notification permission denied')
        return null
      }

      // Get VAPID public key
      const vapidPublicKey = await this.getVapidPublicKey()

      // Subscribe to push manager
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
      })

      console.log('Push subscription created:', subscription)

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)

      return subscription
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      throw error
    }
  }

  // Send subscription data to server
  private async sendSubscriptionToServer(
    subscription: PushSubscription,
  ): Promise<void> {
    try {
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(
            String.fromCharCode(
              ...new Uint8Array(subscription.getKey('p256dh')!),
            ),
          ),
          auth: btoa(
            String.fromCharCode(
              ...new Uint8Array(subscription.getKey('auth')!),
            ),
          ),
        },
      }

      await api.post('/push-notifications/subscribe', subscriptionData)
      console.log('Subscription sent to server successfully')
    } catch (error) {
      console.error('Error sending subscription to server:', error)
      throw error
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.registration) {
        console.log('No service worker registration found')
        return false
      }

      const subscription = await this.registration.pushManager.getSubscription()
      if (!subscription) {
        console.log('No push subscription found')
        return false
      }

      // Unsubscribe from push manager
      const result = await subscription.unsubscribe()

      // Remove subscription from server
      if (result) {
        await api.delete('/push-notifications/unsubscribe', {
          data: { endpoint: subscription.endpoint },
        })
      }

      console.log('Successfully unsubscribed from push notifications')
      return result
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      throw error
    }
  }

  // Get current subscription status
  async getSubscription(): Promise<PushSubscription | null> {
    try {
      if (!this.registration) {
        this.registration =
          (await navigator.serviceWorker.getRegistration()) || null
      }

      if (!this.registration) {
        return null
      }

      return await this.registration.pushManager.getSubscription()
    } catch (error) {
      console.error('Error getting push subscription:', error)
      return null
    }
  }

  // Check if user is subscribed
  async isSubscribed(): Promise<boolean> {
    const subscription = await this.getSubscription()
    return subscription !== null
  }
}

export const pushNotificationService = new PushNotificationService()
