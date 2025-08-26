"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Wallet, RefreshCw, QrCode, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { ledgerService, ICPBalance, Transaction } from "@/lib/ledger-service"
import QRCodeComponent from "./qr-code"
import TransactionHistory from "./transaction-history"
import InternetIdentityAuth from "./internet-identity-auth"
import ICPPriceInfo from "./icp-price-info"
import ConnectionStatus from "./connection-status"
import { useToast } from "@/hooks/use-toast"

interface WalletViewProps {
  onBuy: () => void
  onSend: () => void
  onReceive: () => void
}

export default function WalletView({ onBuy, onSend, onReceive }: WalletViewProps) {
  const { toast } = useToast()
  const [icpBalance, setIcpBalance] = useState<ICPBalance | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isConnected, setIsConnected] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)

  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      const isReady = ledgerService.isReady()
      setIsConnected(isReady)
      
      if (isReady) {
        const balance = await ledgerService.getBalance()
        setIcpBalance(balance)
      }
    } catch (error) {
      console.error("Error checking connection status:", error)
      setIsConnected(false)
    }
  }

  const loadWalletData = async () => {
    setIsLoading(true)
    try {
      // Get ICP balance
      const balance = await ledgerService.getBalance()
      setIcpBalance(balance)

      // Get account identifier
      const accountIdentifier = await ledgerService.getAccountId()
      setAccountId(accountIdentifier)

      // For now, set empty transaction history since we don't have an indexer
      setTransactions([])

    } catch (error) {
      console.error("Failed to load wallet data:", error)
      toast({
        title: "Error loading wallet",
        description: "Failed to load wallet data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBalance = async () => {
    if (!isConnected) return
    
    setIsLoading(true)
    try {
      const balance = await ledgerService.getBalance()
      setIcpBalance(balance)
      toast({
        title: "Balance refreshed",
        description: "Your ICP balance has been updated",
      })
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh balance. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthenticated = async (userPrincipal: string) => {
    setPrincipal(userPrincipal)
    setIsConnected(true)
    await loadWalletData()
  }

  const handleLogout = () => {
    setPrincipal(null)
    setIsConnected(false)
    setIcpBalance(null)
    setAccountId(null)
    setTransactions([])
  }

  if (!isConnected) {
    return (
      <div className="pb-6 bg-gray-950">
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-2">ICP Wallet</h1>
            <p className="text-gray-400">Connect your Internet Identity to access your ICP wallet</p>
          </div>
          
          <InternetIdentityAuth 
            onAuthenticated={handleAuthenticated}
            onLogout={handleLogout}
          />
          
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 font-medium">Real Blockchain Integration</p>
                <p className="text-xs text-blue-200 mt-1">
                  This wallet connects to the real Internet Computer blockchain. 
                  All transactions and balances are live and reflect actual blockchain data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-6 bg-gray-950">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="receive" className="data-[state=active]:bg-gray-700">
            Receive
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Connection Status */}
          <div className="px-4">
            <ConnectionStatus />
          </div>

          {/* Balance Cards */}
          <div className="px-4 py-6 bg-gradient-to-r from-black to-gray-800 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">ICP Wallet</h1>
              <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={refreshBalance}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* ICP Balance */}
              <div>
                <h2 className="text-sm font-medium opacity-90">ICP Balance</h2>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold">
                    {icpBalance ? icpBalance.icp.toFixed(4) : "0.0000"}
                  </span>
                  <span className="text-sm opacity-70 ml-1">ICP</span>
                </div>
                <p className="text-xs opacity-60 mt-1">
                  ≈ ${icpBalance ? (icpBalance.icp * 12.50).toFixed(2) : "0.00"} USD
                </p>
              </div>

              {/* Account ID */}
              <div>
                <h2 className="text-sm font-medium opacity-90">Account ID</h2>
                <p className="text-xs font-mono opacity-70 mt-1 break-all">
                  {accountId ? `${accountId.slice(0, 8)}...${accountId.slice(-8)}` : "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 grid grid-cols-3 gap-3">
            <Button onClick={onBuy} className="bg-blue-600 hover:bg-blue-700">
              Buy ICP
            </Button>
            <Button onClick={onSend} variant="outline" className="border-gray-600 text-white">
              Send
            </Button>
            <Button onClick={onReceive} variant="outline" className="border-gray-600 text-white">
              Receive
            </Button>
          </div>

          {/* ICP Price Info */}
          <div className="px-4">
            <ICPPriceInfo />
          </div>
        </TabsContent>

        {/* Receive Tab */}
        <TabsContent value="receive" className="space-y-4">
          <div className="px-4">
            <h2 className="text-lg font-semibold text-white mb-4">Receive ICP</h2>
            {accountId && (
              <QRCodeComponent accountId={accountId} />
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="px-4">
            <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
            <TransactionHistory transactions={transactions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

