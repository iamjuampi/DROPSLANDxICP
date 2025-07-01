"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useArtemis, WalletInfo } from "@/hooks/use-artemis"
import { WalletInstallationGuide } from "./wallet-installation-guide"

interface ArtemisWalletSelectorProps {
  onSuccess?: (principal: string, walletType: string) => void
  onError?: (error: any) => void
  className?: string
}

export function ArtemisWalletSelector({ onSuccess, onError, className }: ArtemisWalletSelectorProps) {
  const { authState, connectWallet } = useArtemis()
  const { toast } = useToast()
  const [showInstallationGuide, setShowInstallationGuide] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)

  // Check if we should show installation guide after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authState.availableWallets.length === 0) {
        console.log("⏰ Timeout reached, showing installation guide")
        setHasTimedOut(true)
      }
    }, 8000) // 8 second timeout

    return () => clearTimeout(timer)
  }, [authState.availableWallets.length])

  const handleConnectWallet = async (wallet: WalletInfo) => {
    try {
      const success = await connectWallet(wallet.id)
      
      if (success && authState.principal) {
        toast({
          title: "¡Conectado!",
          description: `Conectado exitosamente con ${wallet.name}`,
        })
        
        if (onSuccess) {
          onSuccess(authState.principal, authState.walletType || wallet.id)
        }
      } else {
        throw new Error("No se pudo conectar con el wallet")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      
      toast({
        title: "Error de conexión",
        description: `No se pudo conectar con ${wallet.name}`,
        variant: "destructive",
      })
      
      if (onError) onError(error)
    }
  }

  const getWalletIcon = (walletId: string) => {
    switch (walletId) {
      case "internet-identity":
        return "🔐"
      case "plug":
        return "🔌"
      case "stoic":
        return "🧘"
      case "nfid":
        return "🆔"
      default:
        return "💳"
    }
  }

  // Show installation guide if no wallets detected after timeout
  if (hasTimedOut && authState.availableWallets.length === 0) {
    return (
      <div className={className}>
        <WalletInstallationGuide />
        <div className="mt-4 text-center">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            Recargar página
          </Button>
        </div>
      </div>
    )
  }

  if (authState.availableWallets.length === 0) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bright-yellow mx-auto"></div>
            <p className="text-gray-300">Cargando wallets disponibles...</p>
            <p className="text-gray-400 text-sm">Detectando wallets instalados en tu navegador</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Conectar Wallet</h3>
      
      {authState.availableWallets.map((wallet) => (
        <Card 
          key={wallet.id} 
          className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
            wallet.connected ? 'border-bright-yellow' : 'hover:border-gray-600'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getWalletIcon(wallet.id)}</div>
                <div>
                  <p className="text-white font-medium">{wallet.name}</p>
                  <p className="text-sm text-gray-400">
                    {wallet.connected ? "Conectado" : "Disponible"}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => handleConnectWallet(wallet)}
                disabled={authState.connecting || wallet.connected}
                className={`${
                  wallet.connected 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                }`}
              >
                {authState.connecting && !wallet.connected 
                  ? "Conectando..." 
                  : wallet.connected 
                    ? "Conectado" 
                    : "Conectar"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {authState.isConnected && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-600 rounded-lg">
          <p className="text-green-400 text-sm">
            Conectado con: {authState.walletType}
          </p>
          <p className="text-green-300 text-xs mt-1">
            Principal: {authState.principal?.slice(0, 20)}...
          </p>
        </div>
      )}
    </div>
  )
} 