"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import UserProfile from "@/components/user-profile"
import { Button } from "@/components/ui/button"

export default function TestProfilePage() {
  const { user, userData, isNFIDUser, loginWithNFID } = useAuth()
  const [testUser, setTestUser] = useState("test_user_123")

  const handleLogin = () => {
    loginWithNFID(testUser)
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Test Profile Editing</h1>
        
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Current State</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>User ID: {user || "Not logged in"}</p>
            <p>User Data: {userData ? JSON.stringify(userData, null, 2) : "No user data"}</p>
            <p>Is NFID User: {isNFIDUser() ? "Yes" : "No"}</p>
          </div>
        </div>

        {!user ? (
          <div className="bg-gray-900 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Login Test</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={testUser}
                onChange={(e) => setTestUser(e.target.value)}
                placeholder="Enter test user ID"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
              />
              <Button onClick={handleLogin} className="bg-bright-yellow text-black">
                Login as Test User
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Component Test</h2>
            <UserProfile
              userId={user}
              username={userData?.username || "Test User"}
              handle={userData?.handle}
              profilePhoto={userData?.profilePhoto}
              coverPhoto={userData?.coverPhoto}
              isVerified={userData?.isVerified}
              type={userData?.type}
              bio={userData?.bio}
              followers={userData?.followers?.length || 0}
              following={userData?.following?.length || 0}
              genre={userData?.genre}
            />
          </div>
        )}

        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Instructions</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>1. Login with a test user ID</p>
            <p>2. Look for the "Editar Perfil" button on the profile</p>
            <p>3. Click it to open the profile editor</p>
            <p>4. Try editing the profile photo, cover photo, username, and handle</p>
            <p>5. Check the browser console for debug messages</p>
          </div>
        </div>
      </div>
    </div>
  )
} 