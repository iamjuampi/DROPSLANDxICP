"use client"

import { ArrowDown, ArrowUp, Heart, MessageCircle, User } from "lucide-react"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Importar el hook useAuth
import { useAuth } from "@/hooks/use-auth"

// Mock data for activity
const ACTIVITIES = [
  {
    id: "a1",
    type: "donation_sent",
    user: {
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 5,
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "purchase",
    amount: 50,
    wldAmount: 0.5,
    time: "1 day ago",
  },
  {
    id: "a3",
    type: "donation_received",
    user: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 10,
    time: "3 days ago",
  },
  {
    id: "a4",
    type: "donation_sent",
    user: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 20,
    time: "1 week ago",
  },
  {
    id: "a5",
    type: "purchase",
    amount: 100,
    wldAmount: 1,
    time: "2 weeks ago",
  },
]

// Mock data for social notifications
const SOCIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "like",
    user: {
      name: "Juan Pablo",
      avatar: "/avatars/user.jpg",
    },
    action: "liked your post",
    postContent: "Just finished a new track! Can't wait to share it with you all.",
    time: "5 minutes ago",
  },
  {
    id: "n2",
    type: "comment",
    user: {
      name: "Banger",
      avatar: "/avatars/banger.jpg",
    },
    action: "commented on your post",
    comment: "Amazing track! 🔥",
    time: "1 hour ago",
  },
  {
    id: "n3",
    type: "follow",
    user: {
      name: "Nicola Marti",
      avatar: "/avatars/nicola.jpg",
    },
    action: "started following you",
    time: "2 hours ago",
  },
  {
    id: "n4",
    type: "like",
    user: {
      name: "AXS",
      avatar: "/avatars/axs.jpg",
    },
    action: "liked your post",
    postContent: "Working on something special for my supporters. Stay tuned!",
    time: "3 hours ago",
  },
  {
    id: "n5",
    type: "comment",
    user: {
      name: "FLUSH",
      avatar: "/avatars/flush.jpg",
    },
    action: "commented on your post",
    comment: "Can't wait to hear it! 🎵",
    time: "1 day ago",
  },
]

// Modificar la función ActivityScreen para mostrar el balance actual
export default function ActivityScreen() {
  const { balance } = useAuth() // Obtener el balance del contexto

  return (
    <div className="h-full overflow-auto pb-20">
      <div className="bg-primary p-4">
        <h1 className="text-white font-bold text-xl mb-4">Activity</h1>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available Balance</p>
              <div className="flex items-center mt-1">
                <BanknoteIcon className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold">{balance} DROPS</span>
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Buy More</button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="social" className="data-[state=active]:bg-teal-600">Social</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-teal-600">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-4">
            <div className="space-y-3">
              {SOCIAL_NOTIFICATIONS.map((notification) => (
                <Card key={notification.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{notification.user.name}</span>
                          <span className="text-gray-400">{notification.action}</span>
                          {notification.type === "like" && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                          {notification.type === "comment" && <MessageCircle className="h-4 w-4 text-blue-500" />}
                          {notification.type === "follow" && <User className="h-4 w-4 text-green-500" />}
                        </div>
                        {notification.postContent && (
                          <p className="text-sm text-gray-300 mb-1">"{notification.postContent}"</p>
                        )}
                        {notification.comment && (
                          <p className="text-sm text-gray-300 mb-1">"{notification.comment}"</p>
                        )}
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-white">Transaction History</h2>
              <button className="text-teal-400 text-sm font-medium">Filter</button>
            </div>

            <div className="space-y-3">
              {ACTIVITIES.map((activity) => (
                <Card key={activity.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    {activity.type === "donation_sent" && (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                          <ArrowUp className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">Donation to {activity.user?.name || "Unknown"}</p>
                            <p className="text-red-500 font-medium">-{activity.amount} DROPS</p>
                          </div>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    )}

                    {activity.type === "donation_received" && (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <ArrowDown className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">Donation from {activity.user?.name || "Unknown"}</p>
                            <p className="text-green-500 font-medium">+{activity.amount} DROPS</p>
                          </div>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    )}

                    {activity.type === "purchase" && (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <BanknoteIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">Purchased DROPS</p>
                            <p className="text-green-500 font-medium">+{activity.amount} DROPS</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            <p className="text-xs text-gray-500">-{activity.wldAmount} WLD</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

