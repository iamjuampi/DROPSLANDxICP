"use client"

import { useState, useEffect } from "react"
import { Home, Search, Wallet, Heart, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import InternetIdentityAuth from "@/components/internet-identity-auth"
import HomeView from "@/components/home-view"
import SearchView from "@/components/search-view"
import WalletView from "@/components/wallet-view"
import ActivityView from "@/components/activity-view"
import ProfileView from "@/components/profile-view"
import BuyView from "@/components/buy-view"
import SendView from "@/components/send-view"
import ReceiveView from "@/components/receive-view"
import ArtistDashboard from "@/components/artist-dashboard"
import ArtistProfile from "@/components/artist-profile"
import { ledgerService } from "@/lib/ledger-service"

export default function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [currentView, setCurrentView] = useState("main")
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log("Checking authentication status...")
      const authClient = await ledgerService.initialize()
      const isAuth = await ledgerService.isReady()
      console.log("Authentication status:", isAuth)
      if (isAuth) {
        const accountId = await ledgerService.getAccountId()
        console.log("Account ID found:", accountId)
        setPrincipal(accountId)
        setIsAuthenticated(true)
      } else {
        console.log("No authentication found, clearing state")
        setPrincipal(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setPrincipal(null)
      setIsAuthenticated(false)
    }
  }

  const handleAuthenticated = (principal: string) => {
    console.log("User authenticated:", principal)
    setPrincipal(principal)
    setIsAuthenticated(true)
    setCurrentView("main")
    setActiveTab("home")
  }

  const handleLogout = async () => {
    try {
      console.log("Logging out...")
      await ledgerService.logout()
      setPrincipal(null)
      setIsAuthenticated(false)
      setCurrentView("main")
      setActiveTab("home")
      console.log("Logout successful")
    } catch (error) {
      console.error("Error during logout:", error)
      setPrincipal(null)
      setIsAuthenticated(false)
      setCurrentView("main")
      setActiveTab("home")
    }
  }

  const handleBuy = () => {
    setCurrentView("buy")
  }

  const handleSend = () => {
    setCurrentView("send")
  }

  const handleReceive = () => {
    setCurrentView("receive")
  }

  const handleViewArtist = (artistId: string) => {
    setSelectedArtistId(artistId)
    setCurrentView("artist")
  }

  const handleBack = () => {
    setCurrentView("main")
  }

  const handleOpenArtistDashboard = () => {
    setCurrentView("artistDashboard")
  }

  // Render the appropriate content based on the current view
  const renderContent = () => {
    if (currentView === "buy") {
      return <BuyView onBack={handleBack} />
    }

    if (currentView === "send") {
      return <SendView />
    }

    if (currentView === "receive") {
      return <ReceiveView onBack={handleBack} />
    }

    if (currentView === "artistDashboard") {
      return <ArtistDashboard onBack={handleBack} />
    }

    if (currentView === "artist" && selectedArtistId) {
      return <ArtistProfile artistId={selectedArtistId} onBack={handleBack} />
    }

    // Main view content
    if (activeTab === "home") {
      return <HomeView onSelectArtist={handleViewArtist} />
    }

    if (activeTab === "search") {
      return <SearchView onSelectArtist={handleViewArtist} />
    }

    if (activeTab === "wallet") {
      return <WalletView onBuy={handleBuy} onSend={handleSend} onReceive={handleReceive} />
    }

    if (activeTab === "activity") {
      return <ActivityView onSelectArtist={handleViewArtist} />
    }

    if (activeTab === "profile") {
      return <ProfileView username={principal || "User"} />
    }

    return null
  }

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <InternetIdentityAuth 
              onAuthenticated={handleAuthenticated}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* App Header - Solo se muestra cuando el usuario está autenticado */}
      <header className="bg-gray-900 px-4 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/dropsland-logo.png" alt="DROPSLAND" className="h-12 max-w-[180px] object-contain" />
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "profile" && (
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 text-white border-gray-700"
              onClick={handleOpenArtistDashboard}
            >
              Artist Dashboard
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-red-900/20 text-red-300 border-red-700 hover:bg-red-900/30"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-950 pb-24">{renderContent()}</main>

      {/* Tab Bar (iOS style) - Always visible when logged in */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div className="max-w-md w-full bg-gray-900 border-t border-gray-800">
          <div className="flex justify-between items-center px-6 pt-2 pb-8">
            <button
              onClick={() => {
                setActiveTab("home")
                setCurrentView("main")
              }}
              className={`flex flex-col items-center ${activeTab === "home" ? "text-bright-yellow" : "text-gray-400"}`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("search")
                setCurrentView("main")
              }}
              className={`flex flex-col items-center ${activeTab === "search" ? "text-bright-yellow" : "text-gray-400"}`}
            >
              <Search className="h-6 w-6" />
              <span className="text-xs mt-1">Explore</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("wallet")
                setCurrentView("main")
              }}
              className={`flex flex-col items-center ${activeTab === "wallet" ? "text-bright-yellow" : "text-gray-400"}`}
            >
              <Wallet className="h-6 w-6" />
              <span className="text-xs mt-1">Wallet</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("activity")
                setCurrentView("main")
              }}
              className={`flex flex-col items-center ${activeTab === "activity" ? "text-bright-yellow" : "text-gray-400"}`}
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Activity</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("profile")
                setCurrentView("main")
              }}
              className={`flex flex-col items-center ${activeTab === "profile" ? "text-bright-yellow" : "text-gray-400"}`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}