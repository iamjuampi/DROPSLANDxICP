"use client"

import { useState, useEffect, useCallback } from "react"
import { userDataService } from "@/lib/user-data-service"
import { UserData } from "@/lib/types"

export interface WalletInfo {
  id: string
  name: string
  icon: string
  connected: boolean
  principal?: string
}

export interface ArtemisAuthState {
  isConnected: boolean
  principal: string | null
  walletType: string | null
  availableWallets: WalletInfo[]
  connecting: boolean
}

export function useArtemis() {
  const [adapter, setAdapter] = useState<any>(null)
  const [authState, setAuthState] = useState<ArtemisAuthState>({
    isConnected: false,
    principal: null,
    walletType: null,
    availableWallets: [],
    connecting: false
  })

  // Initialize Artemis adapter
  useEffect(() => {
    const initAdapter = async () => {
      try {
        console.log("🔄 Initializing Artemis adapter...")
        
        // Dynamic import to avoid build issues
        const { ArtemisAdapter } = await import("artemis-web3-adapter")
        console.log("✅ ArtemisAdapter imported successfully")
        
        const artemisAdapter = new ArtemisAdapter({
          whitelist: [],
          host: "https://ic0.app", // Always use production host
          dev: false, // Set to false for production
          autoConnect: false,
          timeout: 10000
        })
        console.log("✅ ArtemisAdapter instance created")

        await artemisAdapter.init()
        console.log("✅ ArtemisAdapter initialized")
        setAdapter(artemisAdapter)

        // Get available wallets
        console.log("🔍 Getting available wallets...")
        const wallets = await artemisAdapter.getWallets()
        console.log("📋 Available wallets:", wallets)
        
        if (wallets && wallets.length > 0) {
          const walletInfos: WalletInfo[] = wallets.map((wallet: any) => ({
            id: wallet.id,
            name: wallet.name,
            icon: wallet.icon,
            connected: false
          }))

          console.log("🎯 Processed wallet infos:", walletInfos)
          setAuthState(prev => ({
            ...prev,
            availableWallets: walletInfos
          }))
        } else {
          console.log("⚠️ No wallets detected, trying alternative approach...")
          // Try to manually detect common wallets
          const commonWallets = [
            { id: "internet-identity", name: "Internet Identity", icon: "🔐", connected: false },
            { id: "plug", name: "Plug Wallet", icon: "🔌", connected: false },
            { id: "stoic", name: "Stoic Wallet", icon: "🧘", connected: false }
          ]
          
          setAuthState(prev => ({
            ...prev,
            availableWallets: commonWallets
          }))
        }

        // Check if already connected
        const connectedWallet = await artemisAdapter.getConnectedWallet()
        console.log("🔗 Connected wallet:", connectedWallet)
        
        if (connectedWallet) {
          const principal = await artemisAdapter.getPrincipal()
          console.log("👤 Principal:", principal)
          
          setAuthState(prev => ({
            ...prev,
            isConnected: true,
            principal: principal?.toString() || null,
            walletType: connectedWallet.id,
            availableWallets: prev.availableWallets.map(wallet => ({
              ...wallet,
              connected: wallet.id === connectedWallet.id
            }))
          }))
        }
      } catch (error) {
        console.error("❌ Failed to initialize Artemis adapter:", error)
        // Don't set fallback wallets, let the user see the error
        throw error
      }
    }

    initAdapter()
  }, [])

  // Connect to a specific wallet
  const connectWallet = useCallback(async (walletId: string) => {
    if (!adapter) return false

    try {
      setAuthState(prev => ({ ...prev, connecting: true }))

      const success = await adapter.connectWallet(walletId)
      if (success) {
        const principal = await adapter.getPrincipal()
        const connectedWallet = await adapter.getConnectedWallet()

        setAuthState(prev => ({
          ...prev,
          isConnected: true,
          principal: principal?.toString() || null,
          walletType: connectedWallet?.id || null,
          connecting: false,
          availableWallets: prev.availableWallets.map(wallet => ({
            ...wallet,
            connected: wallet.id === walletId
          }))
        }))

        return true
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }

    setAuthState(prev => ({ ...prev, connecting: false }))
    return false
  }, [adapter])

  // Disconnect current wallet
  const disconnectWallet = useCallback(async () => {
    if (!adapter) return

    try {
      await adapter.disconnectWallet()
      setAuthState(prev => ({
        ...prev,
        isConnected: false,
        principal: null,
        walletType: null,
        availableWallets: prev.availableWallets.map(wallet => ({
          ...wallet,
          connected: false
        }))
      }))
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [adapter])

  // Get user data for the connected principal
  const getUserData = useCallback(() => {
    if (!authState.principal) return null

    // Try to find user by principal first
    let userData = userDataService.getUserByPrincipal(authState.principal)
    
    // If not found, try to find by any field that might match
    if (!userData) {
      const allUsers = userDataService.getAllUsers()
      userData = allUsers.find(user => 
        user.principal === authState.principal ||
        user.id === authState.principal
      ) || null
    }

    return userData
  }, [authState.principal])

  // Create or get user data for the connected principal
  const ensureUserData = useCallback((username?: string) => {
    if (!authState.principal) return null

    let userData = getUserData()
    
    if (!userData) {
      // Create new user
      userData = userDataService.createUser({
        username: username || `user_${authState.principal.slice(0, 8)}`,
        type: "fan",
        principal: authState.principal,
        isIIUser: authState.walletType === "internet-identity"
      })
    }

    return userData
  }, [authState.principal, authState.walletType, getUserData])

  return {
    adapter,
    authState,
    connectWallet,
    disconnectWallet,
    getUserData,
    ensureUserData
  }
} 