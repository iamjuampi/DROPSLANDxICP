"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodeProps {
  accountId: string
  size?: number
}

export default function QRCodeComponent({ accountId, size = 200 }: QRCodeProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accountId)
      setCopied(true)
      toast({
        title: "Account ID copied!",
        description: "Your ICP account identifier has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the account ID manually.",
        variant: "destructive"
      })
    }
  }

  const downloadText = () => {
    const blob = new Blob([accountId], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `icp-account-${accountId.slice(0, 8)}.txt`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  // Simple QR code placeholder with account ID
  const generateSimpleQR = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = size
    canvas.height = size

    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    // Black border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, size - 20, size - 20)

    // Account ID text
    ctx.fillStyle = '#000000'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    
    // Split account ID into chunks for better display
    const chunks = []
    for (let i = 0; i < accountId.length; i += 8) {
      chunks.push(accountId.slice(i, i + 8))
    }

    const lineHeight = 20
    const startY = size / 2 - (chunks.length * lineHeight) / 2

    chunks.forEach((chunk, index) => {
      ctx.fillText(chunk, size / 2, startY + index * lineHeight)
    })

    // Add "ICP Account" label
    ctx.font = 'bold 16px Arial'
    ctx.fillText('ICP Account', size / 2, 30)

    return canvas
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Receive ICP</h3>
      
      {/* Simple QR Code Display */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex items-center justify-center" style={{ width: size + 16, height: size + 16 }}>
        <div className="text-center">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-2">Account QR Code</p>
          <p className="text-xs text-gray-400">Scan to receive ICP</p>
        </div>
      </div>
      
      <div className="w-full max-w-xs">
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-xs text-gray-600 mb-2">Account Identifier:</p>
          <p className="text-sm font-mono text-gray-900 break-all">
            {accountId}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button onClick={copyToClipboard} variant="outline" size="sm">
          {copied ? (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        <Button onClick={downloadText} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Text
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Share the account identifier to receive ICP payments
      </p>
    </div>
  )
} 