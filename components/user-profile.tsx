"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Edit, Camera } from "lucide-react"
import ProfileEditor from "./profile-editor"

interface UserProfileProps {
  userId: string
  username: string
  handle?: string
  profilePhoto?: string
  coverPhoto?: string
  isVerified?: boolean
  type?: "fan" | "artist"
  bio?: string
  followers?: number
  following?: number
  genre?: string
}

export default function UserProfile({
  userId,
  username,
  handle,
  profilePhoto,
  coverPhoto,
  isVerified = false,
  type = "fan",
  bio,
  followers = 0,
  following = 0,
  genre
}: UserProfileProps) {
  const { user, userData, isNFIDUser } = useAuth()
  const [showEditor, setShowEditor] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    id: userId,
    username,
    handle,
    profilePhoto,
    coverPhoto,
    genre,
    bio
  })

  const isOwnProfile = user === userId
  const canEdit = isOwnProfile && isNFIDUser()

  const handleSaveProfile = (updatedUser: any) => {
    console.log("UserProfile: handleSaveProfile called with", updatedUser)
    setCurrentUser(updatedUser)
    setShowEditor(false)
  }

  const handleEditClick = () => {
    console.log("UserProfile: Edit button clicked, showing editor")
    setShowEditor(true)
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-800">
        {currentUser.coverPhoto ? (
          <img
            src={currentUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Camera className="h-12 w-12" />
          </div>
        )}
        
        {/* Edit Button for II Users */}
        {canEdit && (
          <Button
            onClick={handleEditClick}
            className="absolute top-4 right-4 bg-black bg-opacity-70 hover:bg-opacity-90 text-white border border-gray-600"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="relative -mt-16 mb-4">
          <div className="w-32 h-32 bg-gray-800 rounded-full overflow-hidden border-4 border-gray-900">
            {currentUser.profilePhoto ? (
              <img
                src={currentUser.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Camera className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{currentUser.username}</h1>
            {isVerified && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                ✓ Verificado
              </div>
            )}
            {type === "artist" && (
              <div className="bg-bright-yellow text-black px-2 py-1 rounded-full text-xs font-medium">
                Artista
              </div>
            )}
            {type === "fan" && currentUser.genre && (
              <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {currentUser.genre}
              </div>
            )}
          </div>

          {currentUser.handle && (
            <p className="text-gray-400">@{currentUser.handle}</p>
          )}

          {currentUser.bio && (
            <p className="text-gray-300">{currentUser.bio}</p>
          )}
        </div>
      </div>

      {/* Profile Editor Modal */}
      {showEditor && (
        <ProfileEditor
          user={currentUser}
          onSave={handleSaveProfile}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  )
} 