// src/components/AutoPushNotificationSetup.tsx
import React, { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const AutoPushNotificationSetup: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasPrompted, setHasPrompted] = useState(false)
  const { user } = useAuthStore()
  const { isSupported, isSubscribed, permission, subscribe, isLoading } =
    usePushNotifications()

  useEffect(() => {
    // Only show prompt if:
    // 1. User is logged in
    // 2. Push notifications are supported
    // 3. User hasn't been subscribed yet
    // 4. Permission is not denied
    // 5. We haven't prompted them in this session
    if (
      user &&
      isSupported &&
      !isSubscribed &&
      permission !== 'denied' &&
      !hasPrompted &&
      !isLoading
    ) {
      // Show prompt after a short delay to not overwhelm the user
      const timer = setTimeout(() => {
        setShowPrompt(true)
        setHasPrompted(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [user, isSupported, isSubscribed, permission, hasPrompted, isLoading])

  const handleEnable = async () => {
    const success = await subscribe()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Store in sessionStorage to not show again in this session
    sessionStorage.setItem('pushNotificationPromptDismissed', 'true')
  }

  // Check if user dismissed the prompt in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pushNotificationPromptDismissed')
    if (dismissed) {
      setHasPrompted(true)
    }
  }, [])

  if (!showPrompt) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">
                Stay Updated
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-700">
            Get instant notifications about your appointments and important
            health updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleEnable}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="px-3">
              Later
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You can change this setting anytime in your profile.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
