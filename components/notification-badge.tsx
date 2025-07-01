"use client"

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { userDataService } from '@/lib/user-data-service'

interface NotificationBadgeProps {
  onClick?: () => void
}

export default function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      const notifications = userDataService.getNotificationsForUser(user)
      const unread = notifications.filter(n => !n.isRead).length
      setUnreadCount(unread)
    }
  }, [user])

  if (!user) return null

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Bell className="h-5 w-5 text-gray-400" />
      {unreadCount > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  )
} 