"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Clock, Hash } from "lucide-react"
import { Transaction } from "@/lib/ledger-service"

interface TransactionHistoryProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export default function TransactionHistory({ transactions, isLoading = false }: TransactionHistoryProps) {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)

  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(4)} ICP`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTransactionIcon = (type: "send" | "receive") => {
    return type === "send" ? (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    )
  }

  const getTransactionColor = (type: "send" | "receive") => {
    return type === "send" ? "text-red-500" : "text-green-500"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Your transaction history will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                {getTransactionIcon(transaction.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {transaction.type}
                  </p>
                  <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "send" ? "-" : "+"}{formatAmount(transaction.amount)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {transaction.type === "send" ? "To: " : "From: "}
                    {transaction.type === "send" 
                      ? transaction.to?.slice(0, 8) + "..." 
                      : transaction.from?.slice(0, 8) + "..."
                    }
                  </p>
                  
                  {transaction.blockHeight && (
                    <div className="flex items-center space-x-1">
                      <Hash className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {transaction.blockHeight.toString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {transaction.memo && (
                  <p className="text-xs text-gray-500 mt-1">
                    Memo: {transaction.memo}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 