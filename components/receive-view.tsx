"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { ledgerService, ICPBalance } from "@/lib/ledger-service"
import QRCodeComponent from "./qr-code"

interface ReceiveViewProps {
  onBack: () => void
}

export default function ReceiveView({ onBack }: ReceiveViewProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [icpBalance, setIcpBalance] = useState<ICPBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAccountInfo()
  }, [])

  const loadAccountInfo = async () => {
    setIsLoading(true)
    try {
      // Get account identifier
      const accountIdentifier = await ledgerService.getAccountId()
      setAccountId(accountIdentifier)

      // Get ICP balance
      const balance = await ledgerService.getBalance()
      setIcpBalance(balance)
    } catch (error) {
      console.error("Error loading account info:", error)
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!accountId) return
    
    try {
      navigator.clipboard.writeText(accountId)
      setCopied(true)
      toast({
        title: "Account ID copied",
        description: "Your ICP account identifier has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy error",
        description: "Could not copy the account identifier",
        variant: "destructive",
      })
    }
  }

  const shareAccountId = () => {
    if (!accountId) return
    
    if (navigator.share) {
      navigator.share({
        title: "My ICP Account ID",
        text: `Send me ICP: ${accountId}`,
        url: `https://5q5xx-yiaaa-aaaae-qfcvq-cai.icp0.io/`
      })
    } else {
      copyToClipboard()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet data...</p>
        </div>
      </div>
    )
  }

  if (!accountId) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">No wallet connected</p>
          <p className="text-gray-400">Please connect your Internet Identity first</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">Receive ICP</h1>
            <p className="text-sm text-gray-400">Share your account identifier to receive ICP</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Balance</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-white">
                    {icpBalance ? icpBalance.icp.toFixed(4) : "0.0000"} ICP
                  </span>
                  <span className="text-sm opacity-70 ml-1">ICP</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ≈ ${icpBalance ? (icpBalance.icp * 12.50).toFixed(2) : "0.00"} USD
                </p>
              </div>
              <div className="flex items-center text-bright-yellow">
                <BanknoteIcon className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-4">Scan QR Code</h3>
              <p className="text-sm text-gray-400 mb-4 text-center">
                Scan this QR code with another wallet to send ICP to your account
              </p>
              <QRCodeComponent accountId={accountId} />
            </div>
          </CardContent>
        </Card>

        {/* Account Identifier */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-medium text-white mb-2">Your Account Identifier</h3>
            <p className="text-sm text-gray-400 mb-3">
              Share this 64-character account identifier to receive ICP
            </p>
            <div className="bg-gray-700 p-3 rounded-lg mb-3">
              <div className="text-white text-sm font-mono break-all">
                {accountId}
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                onClick={shareAccountId}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-900/20 border-blue-700">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-300 mb-2">How to receive ICP</h3>
            <ul className="text-sm text-blue-200 space-y-2">
              <li className="flex items-start">
                <span className="bg-blue-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Share your account identifier or QR code with the sender</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>The sender uses their ICP wallet to send to your account identifier</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>ICP will appear in your balance within a few seconds</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

