import { HttpAgent, Actor } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { AuthClient } from "@dfinity/auth-client"
import { IDL } from "@dfinity/candid"

export interface ICPBalance {
  e8s: bigint
  icp: number
}

export interface SendICPResult {
  success: boolean
  blockHeight?: bigint
  error?: string
}

export interface Transaction {
  id: string
  type: "send" | "receive"
  amount: number
  to?: string
  from?: string
  timestamp: Date
  blockHeight?: bigint
  memo?: string
}

// Simple function to generate account identifier from principal
function principalToAccountIdentifier(principal: Principal): string {
  const principalBytes = principal.toUint8Array()
  
  // Simple hash function for demo purposes
  let hash = 0
  for (let i = 0; i < principalBytes.length; i++) {
    hash = ((hash << 5) - hash) + principalBytes[i]
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Convert hash to hex string and make it 64 characters
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0')
  return hashHex.repeat(8) // Make it 64 characters
}

// Convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

// Minimal IDL for ICP Ledger (only essential functions)
const ledger_idl = IDL.Service({
  account_balance: IDL.Func(
    [IDL.Record({ account: IDL.Vec(IDL.Nat8) })],
    [IDL.Record({ e8s: IDL.Nat64 })],
    ['query']
  ),
  transfer: IDL.Func(
    [
      IDL.Record({
        to: IDL.Vec(IDL.Nat8),
        fee: IDL.Record({ e8s: IDL.Nat64 }),
        memo: IDL.Nat64,
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Record({ timestamp_nanos: IDL.Nat64 })),
        amount: IDL.Record({ e8s: IDL.Nat64 })
      })
    ],
    [
      IDL.Variant({
        Ok: IDL.Nat64,
        Err: IDL.Variant({
          BadFee: IDL.Record({ expected_fee: IDL.Record({ e8s: IDL.Nat64 }) }),
          BadBurn: IDL.Record({ min_burn_amount: IDL.Record({ e8s: IDL.Nat64 }) }),
          InsufficientFunds: IDL.Record({ balance: IDL.Record({ e8s: IDL.Nat64 }) }),
          TooOld: IDL.Null,
          CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
          Duplicate: IDL.Record({ duplicate_of: IDL.Nat64 }),
          TemporarilyUnavailable: IDL.Null,
          GenericError: IDL.Record({ error_code: IDL.Nat64, message: IDL.Text })
        })
      })
    ],
    []
  ),
  transfer_fee: IDL.Func(
    [IDL.Record({})],
    [IDL.Record({ transfer_fee: IDL.Record({ e8s: IDL.Nat64 }) })],
    ['query']
  )
})

class LedgerService {
  private agent: HttpAgent | null = null
  private ledger: any = null
  private authClient: AuthClient | null = null
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  // ICP Ledger Canister ID (mainnet)
  private readonly LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai"

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log("LedgerService already initialized")
      return
    }

    if (this.initializationPromise) {
      console.log("Initialization already in progress, waiting...")
      return this.initializationPromise
    }

    this.initializationPromise = this._initialize()
    return this.initializationPromise
  }

  private async _initialize(): Promise<void> {
    try {
      console.log("Starting LedgerService initialization...")
      
      // Create auth client
      console.log("Creating AuthClient...")
      this.authClient = await AuthClient.create()
      console.log("AuthClient created successfully")
      
      // Check if authenticated
      const isAuthenticated = await this.authClient.isAuthenticated()
      console.log("Authentication status:", isAuthenticated)
      
      if (!isAuthenticated) {
        throw new Error("User not authenticated with Internet Identity")
      }

      // Get identity
      const identity = this.authClient.getIdentity()
      console.log("Identity obtained:", identity.getPrincipal().toText())

      // Create agent
      console.log("Creating HttpAgent...")
      this.agent = new HttpAgent({
        identity,
        host: "https://ic0.app"
      })
      console.log("HttpAgent created successfully")

      // Create ledger actor
      console.log("Creating ledger actor...")
      this.ledger = Actor.createActor(ledger_idl as any, {
        agent: this.agent,
        canisterId: this.LEDGER_CANISTER_ID
      })
      console.log("Ledger actor created successfully")

      this.isInitialized = true
      console.log("LedgerService initialization completed successfully")
    } catch (error) {
      console.error("Error during LedgerService initialization:", error)
      this.isInitialized = false
      this.initializationPromise = null
      throw new Error(`Failed to initialize ledger service: ${error}`)
    }
  }

  async getAccountId(): Promise<string> {
    await this.initialize()
    
    if (!this.authClient) {
      throw new Error("AuthClient not available")
    }

    const identity = this.authClient.getIdentity()
    const principal = identity.getPrincipal()
    const accountId = principalToAccountIdentifier(principal)
    
    console.log("Generated account ID:", accountId)
    return accountId
  }

  async getBalance(): Promise<ICPBalance> {
    await this.initialize()
    
    if (!this.ledger) {
      throw new Error("Ledger not initialized")
    }

    try {
      const accountId = await this.getAccountId()
      const accountBytes = hexToBytes(accountId)
      
      console.log("Fetching balance for account:", accountId)
      const balance = await this.ledger.account_balance({ 
        account: accountBytes
      })
      
      const icp = Number(balance.e8s) / 100000000
      console.log("Balance fetched:", icp, "ICP")
      
      return {
        e8s: balance.e8s,
        icp
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      throw new Error(`Failed to fetch balance: ${error}`)
    }
  }

  async getTransferFee(): Promise<bigint> {
    await this.initialize()
    
    if (!this.ledger) {
      throw new Error("Ledger not initialized")
    }

    try {
      const fee = await this.ledger.transfer_fee({})
      console.log("Transfer fee:", fee.transfer_fee.e8s)
      return fee.transfer_fee.e8s
    } catch (error) {
      console.error("Error fetching transfer fee:", error)
      // Return default fee if error
      return BigInt(10000) // 0.0001 ICP
    }
  }

  async sendICP(to: string, amount: number): Promise<SendICPResult> {
    await this.initialize()
    
    if (!this.ledger || !this.authClient) {
      throw new Error("Ledger or AuthClient not initialized")
    }

    try {
      console.log(`Sending ${amount} ICP to: ${to}`)
      
      // Validate account identifier
      if (to.length !== 64) {
        throw new Error("Invalid account identifier. Must be 64 characters long.")
      }

      // Validate hex format
      if (!/^[0-9a-fA-F]+$/.test(to)) {
        throw new Error("Invalid account identifier format. Must be hexadecimal.")
      }

      const toBytes = hexToBytes(to)
      const amountE8s = BigInt(Math.floor(amount * 100000000))
      const fee = await this.getTransferFee()
      
      console.log("Transfer details:", {
        to: to,
        amount: amountE8s.toString(),
        fee: fee.toString()
      })

      const transfer = await this.ledger.transfer({
        to: toBytes,
        fee: { e8s: fee },
        memo: BigInt(0),
        from_subaccount: [],
        created_at_time: [],
        amount: { e8s: amountE8s }
      })

      if ("Ok" in transfer) {
        console.log("Transfer successful, block height:", transfer.Ok)
        return {
          success: true,
          blockHeight: transfer.Ok
        }
      } else {
        console.error("Transfer failed:", transfer.Err)
        const errorMessage = this.getErrorMessage(transfer.Err)
        return {
          success: false,
          error: errorMessage
        }
      }
    } catch (error) {
      console.error("Error sending ICP:", error)
      return {
        success: false,
        error: `Failed to send ICP: ${error}`
      }
    }
  }

  private getErrorMessage(error: any): string {
    if ("BadFee" in error) {
      return `Bad fee. Expected: ${error.BadFee.expected_fee.e8s} e8s`
    } else if ("BadBurn" in error) {
      return `Bad burn amount. Minimum: ${error.BadBurn.min_burn_amount.e8s} e8s`
    } else if ("InsufficientFunds" in error) {
      return `Insufficient funds. Balance: ${error.InsufficientFunds.balance.e8s} e8s`
    } else if ("TooOld" in error) {
      return "Transaction too old"
    } else if ("CreatedInFuture" in error) {
      return `Transaction created in future. Ledger time: ${error.CreatedInFuture.ledger_time}`
    } else if ("Duplicate" in error) {
      return `Duplicate transaction. Block: ${error.Duplicate.duplicate_of}`
    } else if ("TemporarilyUnavailable" in error) {
      return "Service temporarily unavailable"
    } else if ("GenericError" in error) {
      return `Generic error: ${error.GenericError.message}`
    } else {
      return "Unknown error occurred"
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("Logging out from LedgerService...")
      if (this.authClient) {
        await this.authClient.logout()
      }
      this.agent = null
      this.ledger = null
      this.authClient = null
      this.isInitialized = false
      this.initializationPromise = null
      console.log("Logout completed successfully")
    } catch (error) {
      console.error("Error during logout:", error)
      // Reset state even if there's an error
      this.agent = null
      this.ledger = null
      this.authClient = null
      this.isInitialized = false
      this.initializationPromise = null
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.ledger !== null
  }
}

export const ledgerService = new LedgerService() 