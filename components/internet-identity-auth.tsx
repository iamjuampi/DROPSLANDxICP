"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AuthClient } from "@dfinity/auth-client"
import { ledgerService } from "@/lib/ledger-service"

interface InternetIdentityAuthProps {
  onAuthenticated: (principal: string) => void
  onLogout: () => void
}

export default function InternetIdentityAuth({ onAuthenticated, onLogout }: InternetIdentityAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const authClient = await AuthClient.create()
      const isAuth = await authClient.isAuthenticated()
      
      if (isAuth) {
        const identity = authClient.getIdentity()
        const principalText = identity.getPrincipal().toText()
        setPrincipal(principalText)
        setIsAuthenticated(true)
        onAuthenticated(principalText)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const authClient = await AuthClient.create()
      
      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: async () => {
          const identity = authClient.getIdentity()
          const principalText = identity.getPrincipal().toText()
          
          setPrincipal(principalText)
          setIsAuthenticated(true)
          onAuthenticated(principalText)
          
          // Initialize ledger service
          await ledgerService.initialize()
          
          toast({
            title: "Connected successfully!",
            description: `Welcome! Your principal: ${principalText.slice(0, 8)}...`,
          })
        },
        onError: (error) => {
          console.error("Login error:", error)
          toast({
            title: "Login failed",
            description: "Failed to connect with Internet Identity",
            variant: "destructive"
          })
        }
      })
    } catch (error) {
      console.error("Error during login:", error)
      toast({
        title: "Connection error",
        description: "Failed to connect with Internet Identity",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await ledgerService.logout()
      setPrincipal(null)
      setIsAuthenticated(false)
      onLogout()
      
      toast({
        title: "Disconnected",
        description: "You have been disconnected from Internet Identity",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isAuthenticated && principal) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connected Successfully</h2>
          <p className="text-green-300 text-sm">You're now connected to Internet Identity</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Principal ID:</p>
          <p className="text-sm font-mono text-green-100 break-all bg-gray-900/50 p-2 rounded">
            {principal}
          </p>
        </div>
        
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-600 text-red-300 hover:bg-red-900/20 hover:border-red-500"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
      </div>
      
      <Button 
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect Internet Identity
          </div>
        )}
      </Button>
      
      <div className="bg-gray-800/20 border border-gray-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-300 font-medium">Secure Connection</p>
            <p className="text-xs text-gray-200 mt-1">
              Your connection is secured by the Internet Computer blockchain. No personal data is stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 