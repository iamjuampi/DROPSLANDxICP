"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface FallbackWalletSelectorProps {
  onSuccess?: (principal: string, walletType: string) => void
  onError?: (error: any) => void
  className?: string
}

const FALLBACK_WALLETS = [
  { id: "internet-identity", name: "Internet Identity", icon: "🔐", description: "Official IC identity provider" },
  { id: "plug", name: "Plug Wallet", icon: "🔌", description: "Popular IC wallet" },
  { id: "stoic", name: "Stoic Wallet", icon: "🧘", description: "Simple and secure wallet" },
  { id: "nfid", name: "NFID", icon: "🆔", description: "Next generation identity" }
]

export function FallbackWalletSelector({ onSuccess, onError, className }: FallbackWalletSelectorProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const { toast } = useToast()

  const handleConnectWallet = async (wallet: typeof FALLBACK_WALLETS[0]) => {
    setConnecting(wallet.id)
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, generate a fake principal
      const fakePrincipal = `fake_principal_${wallet.id}_${Date.now()}`
      
      toast({
        title: "¡Conectado!",
        description: `Conectado exitosamente con ${wallet.name}`,
      })
      
      if (onSuccess) {
        onSuccess(fakePrincipal, wallet.id)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      
      toast({
        title: "Error de conexión",
        description: `No se pudo conectar con ${wallet.name}`,
        variant: "destructive",
      })
      
      if (onError) onError(error)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Conectar Wallet</h3>
      
      <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
        <p className="text-yellow-400 text-sm">
          ⚠️ Modo de demostración: Los wallets se simulan para propósitos de prueba
        </p>
      </div>
      
      {FALLBACK_WALLETS.map((wallet) => (
        <Card 
          key={wallet.id} 
          className="bg-gray-800 border-gray-700 cursor-pointer transition-colors hover:border-gray-600"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{wallet.icon}</div>
                <div>
                  <p className="text-white font-medium">{wallet.name}</p>
                  <p className="text-sm text-gray-400">{wallet.description}</p>
                </div>
              </div>
              
              <Button
                onClick={() => handleConnectWallet(wallet)}
                disabled={connecting === wallet.id}
                className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              >
                {connecting === wallet.id ? "Conectando..." : "Conectar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
        <p className="text-blue-400 text-sm">
          💡 En producción, estos botones conectarían con wallets reales usando Artemis
        </p>
      </div>
    </div>
  )
} 