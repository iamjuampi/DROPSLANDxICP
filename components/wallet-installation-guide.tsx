"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface WalletInstallationGuideProps {
  className?: string
}

const WALLET_INSTALLATION_GUIDES = [
  {
    id: "internet-identity",
    name: "Internet Identity",
    icon: "🔐",
    description: "Identidad oficial de Internet Computer",
    installUrl: "https://identity.ic0.app/",
    installText: "Crear Identidad"
  },
  {
    id: "plug",
    name: "Plug Wallet",
    icon: "🔌",
    description: "Wallet popular para Internet Computer",
    installUrl: "https://plugwallet.ooo/",
    installText: "Instalar Extensión"
  },
  {
    id: "stoic",
    name: "Stoic Wallet",
    icon: "🧘",
    description: "Wallet simple y segura",
    installUrl: "https://www.stoicwallet.com/",
    installText: "Instalar Wallet"
  }
]

export function WalletInstallationGuide({ className }: WalletInstallationGuideProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">Instalar Wallets</h3>
        <p className="text-gray-400 text-sm">
          Para usar DROPSLAND, necesitas instalar al menos uno de estos wallets:
        </p>
      </div>
      
      {WALLET_INSTALLATION_GUIDES.map((wallet) => (
        <Card key={wallet.id} className="bg-gray-800 border-gray-700">
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
                onClick={() => window.open(wallet.installUrl, "_blank")}
                className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {wallet.installText}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
        <p className="text-blue-400 text-sm">
          💡 Después de instalar un wallet, recarga la página para que DROPSLAND lo detecte
        </p>
      </div>
    </div>
  )
} 