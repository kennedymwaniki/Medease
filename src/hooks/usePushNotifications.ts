// src/hooks/usePushNotifications.ts
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
// import { pushNotificationService } from '@/services/pushNotificationService'
import { useAuthStore } from '@/store/authStore'
import { pushNotificationService } from '@/lib/pushNotificationService'

export interface PushNotificationState {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permission: NotificationPermission
  error: string | null
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    permission: 'default',
    error: null,
  })

  const { user } = useAuthStore()

  // Initialize push notification state
  const initializePushNotifications = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const isSupported = pushNotificationService.isSupported()
      const permission = Notification.permission
      const isSubscribed = isSupported
        ? await pushNotificationService.isSubscribed()
        : false

      setState({
        isSupported,
        isSubscribed,
        isLoading: false,
        permission,
        error: null,
      })
    } catch (error) {
      console.error('Error initializing push notifications:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }))
    }
  }, [])

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      toast.error('Push notifications are not supported in this browser')
      return false
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const subscription = await pushNotificationService.subscribe()

      if (subscription) {
        setState((prev) => ({
          ...prev,
          isSubscribed: true,
          isLoading: false,
          permission: 'granted',
          error: null,
        }))

        toast.success('Push notifications enabled successfully!')
        return true
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to subscribe to push notifications',
        }))

        toast.error('Failed to enable push notifications')
        return false
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      toast.error(`Failed to enable push notifications: ${errorMessage}`)
      return false
    }
  }, [state.isSupported])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const success = await pushNotificationService.unsubscribe()

      if (success) {
        setState((prev) => ({
          ...prev,
          isSubscribed: false,
          isLoading: false,
          error: null,
        }))

        toast.success('Push notifications disabled successfully!')
        return true
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to unsubscribe from push notifications',
        }))

        toast.error('Failed to disable push notifications')
        return false
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      toast.error(`Failed to disable push notifications: ${errorMessage}`)
      return false
    }
  }, [])

  // Request permission only
  const requestPermission = useCallback(async () => {
    try {
      const permission = await pushNotificationService.requestPermission()
      setState((prev) => ({ ...prev, permission }))
      return permission
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      toast.error('Failed to request notification permission')
      return 'denied'
    }
  }, [])

  // Auto-initialize when user is available
  useEffect(() => {
    if (user) {
      initializePushNotifications()
    }
  }, [user, initializePushNotifications])

  return {
    ...state,
    subscribe,
    unsubscribe,
    requestPermission,
    refresh: initializePushNotifications,
  }
}
