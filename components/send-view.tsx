"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ledgerService } from "@/lib/ledger-service"
import { Send, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SendView() {
  const { toast } = useToast()
  const [icpRecipient, setIcpRecipient] = useState("")
  const [icpAmount, setIcpAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transferFee, setTransferFee] = useState<bigint | null>(null)

  const handleSendICP = async () => {
    if (!icpRecipient.trim() || !icpAmount.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both recipient and amount",
        variant: "destructive",
      })
      return
    }

    const amount = parseFloat(icpAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      })
      return
    }

    // Validate account identifier format
    if (icpRecipient.length !== 64 || !/^[0-9a-fA-F]+$/.test(icpRecipient)) {
      toast({
        title: "Invalid account identifier",
        description: "Please enter a valid 64-character hexadecimal ICP account identifier",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await ledgerService.sendICP(icpRecipient, amount)
      
      if (result.success) {
        toast({
          title: "Transfer successful!",
          description: `Successfully sent ${amount} ICP. Block height: ${result.blockHeight}`,
        })
        setIcpRecipient("")
        setIcpAmount("")
      } else {
        toast({
          title: "Transfer failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending ICP:", error)
      toast({
        title: "Error",
        description: "Failed to send ICP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTransferFee = async () => {
    try {
      const fee = await ledgerService.getTransferFee()
      setTransferFee(fee)
    } catch (error) {
      console.error("Error getting transfer fee:", error)
    }
  }

  // Get transfer fee when component mounts
  useEffect(() => {
    getTransferFee()
  }, [])

  const feeInICP = transferFee ? Number(transferFee) / 100000000 : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send ICP
          </CardTitle>
          <CardDescription>
            Send ICP to another account on the Internet Computer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Account ID</Label>
            <Input
              id="recipient"
              placeholder="Enter 64-character account identifier"
              value={icpRecipient}
              onChange={(e) => setIcpRecipient(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              The account identifier should be 64 characters long and contain only hexadecimal characters (0-9, a-f, A-F)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ICP)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min="0"
              placeholder="0.000001"
              value={icpAmount}
              onChange={(e) => setIcpAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Minimum amount: 0.000001 ICP
            </p>
          </div>

          {transferFee && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Transfer fee: {feeInICP.toFixed(8)} ICP
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Make sure you have enough ICP to cover both the transfer amount and the fee. 
              Double-check the recipient address before sending.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleSendICP} 
            disabled={isLoading || !icpRecipient.trim() || !icpAmount.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send ICP
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

