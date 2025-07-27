// src/components/PushNotificationSetup.tsx
import React from 'react'
import { AlertTriangle, Bell, BellOff, Loader2 } from 'lucide-react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PushNotificationSetupProps {
  className?: string
  showCard?: boolean
}

export const PushNotificationSetup: React.FC<PushNotificationSetupProps> = ({
  className = '',
  showCard = true,
}) => {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    error,
    subscribe,
    unsubscribe,
  } = usePushNotifications()

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      await subscribe()
    }
  }

  const getStatusColor = () => {
    if (isSubscribed) return 'text-green-600'
    if (permission === 'denied') return 'text-red-600'
    return 'text-yellow-600'
  }

  const getStatusText = () => {
    if (isLoading) return 'Checking...'
    if (!isSupported) return 'Not Supported'
    if (isSubscribed) return 'Enabled'
    if (permission === 'denied') return 'Blocked'
    return 'Disabled'
  }

  const content = (
    <div className={className}>
      <div className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              <Bell className={`h-4 w-4 ${getStatusColor()}`} />
            ) : (
              <BellOff className={`h-4 w-4 ${getStatusColor()}`} />
            )}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              Push Notifications: {getStatusText()}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Not Supported Warning */}
        {!isSupported && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              Push notifications are not supported in this browser. Please use a
              modern browser like Chrome, Firefox, or Edge.
            </AlertDescription>
          </Alert>
        )}

        {/* Permission Denied Warning */}
        {isSupported && permission === 'denied' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Push notifications are blocked. Please enable them in your browser
              settings to receive important updates about your appointments.
            </AlertDescription>
          </Alert>
        )}

        {/* Description */}
        {isSupported && permission !== 'denied' && (
          <div className="text-sm text-gray-600">
            {isSubscribed
              ? "You'll receive notifications about new appointments, prescription updates, and important reminders."
              : 'Enable push notifications to stay updated about your appointments and important health reminders.'}
          </div>
        )}

        {/* Toggle Button */}
        {isSupported && permission !== 'denied' && (
          <Button
            onClick={handleToggleNotifications}
            disabled={isLoading}
            variant={isSubscribed ? 'outline' : 'default'}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSubscribed ? 'Disabling...' : 'Enabling...'}
              </>
            ) : (
              <>
                {isSubscribed ? (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Disable Notifications
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Enable Notifications
                  </>
                )}
              </>
            )}
          </Button>
        )}

        {/* Browser Settings Help */}
        {permission === 'denied' && (
          <div className="text-xs text-gray-500">
            <p>
              <strong>To enable notifications:</strong>
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Click the lock icon in your address bar</li>
              <li>Set notifications to "Allow"</li>
              <li>Refresh the page</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )

  if (showCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    )
  }

  return content
}
