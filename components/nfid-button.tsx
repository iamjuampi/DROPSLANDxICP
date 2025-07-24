"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AuthClient } from "@dfinity/auth-client"
import { Identity } from "@dfinity/agent"

interface NFIDButtonProps {
  onSuccess: (identity: Identity) => void
  onError?: (error: any) => void
  children?: React.ReactNode
  className?: string
}

export function NFIDButton({ onSuccess, onError, children, className }: NFIDButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Initialize AuthClient
      const authClient = await AuthClient.create()
      
      // Start login process
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app",
          onSuccess: () => {
            const identity = authClient.getIdentity()
            onSuccess(identity)
            toast({
              title: "¡Conectado!",
              description: "Conectado exitosamente con Internet Identity",
            })
            resolve()
          },
          onError: (error) => {
            console.error("Login error:", error)
            reject(error)
          },
        })
      })
    } catch (error) {
      console.error("Error connecting:", error)
      
      let errorMessage = "No se pudo conectar"
      if (error instanceof Error) {
        if (error.message.includes('user')) {
          errorMessage = "Conexión cancelada por el usuario"
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Error de conexión",
        description: errorMessage,
        variant: "destructive",
      })
      if (onError) onError(error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className={className}
    >
      {isConnecting ? "Conectando..." : children || "Internet Identity"}
    </Button>
  )
} 