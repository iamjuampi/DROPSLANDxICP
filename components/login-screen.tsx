"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { User, Lock } from "lucide-react"

interface LoginScreenProps {
  onLogin: (username: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      })
      return
    }

    // Lógica de autenticación local
    if (username === "iamjuampi" && password === "1234") {
      onLogin("iamjuampi")
    } else if (["juampi", "banger", "nicolamarti", "axs", "flush", "daniloDR", "spitflux", "kr4d", "fan"].includes(username)) {
       // Aquí podrías agregar una validación de contraseña para los otros usuarios si fuera necesario
       // Por ahora, solo verificamos el usuario para los otros casos
       onLogin(username)
    } else {
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
  }

  const handleNFIDLogin = async () => {
    try {
      console.log("Simulating NFID login...")
      // Simulamos un delay para que parezca que está cargando
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulamos un login exitoso
      console.log("NFID login successful")
      onLogin("iamjuampi") // Simula login como iamjuampi via NFID
    } catch (error) {
      console.error("NFID login error:", error)
      toast({
        title: "Error",
        description: "Failed to login with NFID",
        variant: "destructive",
      })
    }
  }

  const handleRegisterClick = () => {
    toast({
      title: "Coming Soon",
      description: "Registration is not available yet.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-6 mt-24">
        <div className="text-center space-y-2">
          <Image
            src="/images/dropsland-logo.png"
            alt="DROPSLAND"
            width={200}
            height={80}
            className="mx-auto"
          />
          <p className="text-gray-400">Support artists with music tokens</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-gray-800 text-white border-gray-700 h-11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-gray-800 text-white border-gray-700 h-11"
              />
              {/* Opcional: icono de ojo para mostrar/ocultar contraseña */}
              {/* <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" /> */}
            </div>
          </div>

          <Button
            className="w-full bg-bright-yellow hover:bg-bright-yellow-700 text-black h-11"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="px-2 bg-gray-950 text-gray-400">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-gray-800 text-white border-gray-700 flex items-center justify-center h-11"
          onClick={handleNFIDLogin}
        >
          Login with NFID
        </Button>

        <p className="text-sm text-gray-400 text-center">
          Don't have an account?{" "}
          <a href="#" className="text-bright-yellow hover:underline"
             onClick={handleRegisterClick}
          >
            Register
          </a>
        </p>
      </div>

      {/* Copyright en la parte inferior */}
      <div className="w-full text-center pb-4 mt-auto">
        <p className="text-xs text-gray-500">© 2025 DROPSLAND. All rights reserved.</p>
      </div>
    </div>
  )
}

