"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export default function ICPPriceInfo() {
  const [icpPrice, setIcpPrice] = useState<number>(12.50)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchICPPrice()
    const interval = setInterval(fetchICPPrice, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const fetchICPPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd&include_24hr_change=true')
      const data = await response.json()
      
      if (data['internet-computer']) {
        const price = data['internet-computer'].usd
        const change = data['internet-computer'].usd_24h_change || 0
        
        setIcpPrice(price)
        setPriceChange(change)
      }
    } catch (error) {
      console.error("Failed to fetch ICP price:", error)
      // Keep previous values on error
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          ICP Price
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {formatPrice(icpPrice)}
            </span>
            <div className="flex items-center gap-1">
              {getChangeIcon(priceChange)}
              <span className={`text-sm font-medium ${getChangeColor(priceChange)}`}>
                {formatChange(priceChange)}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Price updates every minute • Data from CoinGecko
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 