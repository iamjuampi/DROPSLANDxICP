"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { ledgerService } from "@/lib/ledger-service"
import { useToast } from "@/hooks/use-toast"

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [principal, setPrincipal] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Checking connection status...")
      
      // Try to initialize the ledger service
      await ledgerService.initialize()
      
      // Get account ID
      const accountIdResult = await ledgerService.getAccountId()
      setAccountId(accountIdResult)
      
      // Get balance to test connection
      const balance = await ledgerService.getBalance()
      
      setIsConnected(true)
      console.log("Connection successful:", { accountId: accountIdResult, balance })
      
      toast({
        title: "Connected!",
        description: `Successfully connected to ICP network. Balance: ${balance.icp.toFixed(4)} ICP`,
      })
    } catch (error) {
      console.error("Connection check failed:", error)
      setIsConnected(false)
      setError(error instanceof Error ? error.message : "Unknown error")
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to ICP network",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-5 w-5 animate-spin text-yellow-500" />
    if (isConnected) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusText = () => {
    if (isLoading) return "Connecting..."
    if (isConnected) return "Connected"
    return "Disconnected"
  }

  const getStatusColor = () => {
    if (isLoading) return "text-yellow-500"
    if (isConnected) return "text-green-500"
    return "text-red-500"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wifi className="h-5 w-5" />
          Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {accountId && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Account ID:</span>
            <div className="text-xs bg-gray-800 p-2 rounded break-all font-mono">
              {accountId}
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-red-500">Error:</span>
            <div className="text-xs bg-red-900/20 p-2 rounded text-red-300">
              {error}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={checkConnection}
            disabled={isLoading}
            size="sm"
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Connecting...' : 'Test Connection'}
          </Button>
        </div>

        {!isConnected && (
          <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded">
            <p className="font-medium mb-1">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure you're logged in with Internet Identity</li>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Check the browser console for detailed errors</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 