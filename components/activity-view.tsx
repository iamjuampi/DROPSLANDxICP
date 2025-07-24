"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { userDataService } from "@/lib/user-data-service"
import { Activity } from "@/lib/types"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ActivityViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function ActivityView({ onSelectArtist }: ActivityViewProps) {
  const { userData, isArtist, user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])

  // Load activities for the current user
  useEffect(() => {
    if (user) {
      const userActivities = userDataService.getActivitiesForUser(user)
      setActivities(userActivities)
    }
  }, [user])

  // Function to redirect to artist related to the activity
  const handleSelectArtist = (artistId: string) => {
    console.log("Activity view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="p-4 pb-6 bg-gray-50 dark:bg-gray-950">
      <h1 className="text-xl font-bold mb-4 text-white">Activity</h1>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              onSelectArtist={handleSelectArtist}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-300 font-medium">You don't have any notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {isArtist()
              ? "Interactions with your followers will appear here"
              : "Updates from artists you follow will appear here"}
          </p>
        </div>
      )}
    </div>
  )
}

function ActivityCard({
  activity,
  onSelectArtist,
  formatTimeAgo,
}: {
  activity: Activity
  onSelectArtist: (artistId: string) => void
  formatTimeAgo: (dateString: string) => string
}) {
  return (
    <Card className="overflow-hidden bg-gray-800 border-gray-700">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => onSelectArtist(activity.userId)}>
            <AvatarImage src={activity.userAvatar} alt={activity.userName} />
            <AvatarFallback>{activity.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-white">
              <span className="font-medium cursor-pointer" onClick={() => onSelectArtist(activity.userId)}>
                {activity.userName}
              </span> {activity.action}
            </p>
            {activity.message && (
              <p className="text-sm mt-1 bg-gray-700 p-2 rounded-lg text-gray-300">{activity.message}</p>
            )}
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-400">{formatTimeAgo(activity.createdAt)}</p>
              {activity.amount && activity.tokenName && (
                <div className="flex items-center text-bright-yellow text-xs font-medium ml-2">
                  <BanknoteIcon className="h-4 w-4 mr-1" />
                  <span>
                    {activity.amount} ${activity.tokenName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

