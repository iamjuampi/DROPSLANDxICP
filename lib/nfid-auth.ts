// Temporarily commented out for build compatibility
/*
import { IdentityKit } from "@nfid/identitykit"
import { HttpAgent } from "@dfinity/agent"

// Configuración de NFID
const NFID_CONFIG = {
  applicationName: "Dropsland",
  applicationLogo: "https://your-app-logo.com/logo.png",
  applicationUrl: "https://your-app-url.com",
  applicationDescription: "A decentralized music platform",
  applicationId: "your-application-id"
}

export class NFIDAuth {
  private identityKit: IdentityKit | null = null
  private agent: HttpAgent | null = null

  async initialize() {
    try {
      this.identityKit = new IdentityKit(NFID_CONFIG)
      await this.identityKit.init()
      
      this.agent = new HttpAgent({
        host: "https://ic0.app",
        identity: this.identityKit.getIdentity()
      })
      
      return true
    } catch (error) {
      console.error("Failed to initialize NFID:", error)
      return false
    }
  }

  async authenticate() {
    if (!this.identityKit) {
      throw new Error("NFID not initialized")
    }
    
    try {
      await this.identityKit.authenticate()
      return this.identityKit.getIdentity()
    } catch (error) {
      console.error("Authentication failed:", error)
      throw error
    }
  }

  getAgent() {
    return this.agent
  }

  isAuthenticated() {
    return this.identityKit?.isAuthenticated() || false
  }

  getPrincipal() {
    return this.identityKit?.getIdentity()?.getPrincipal()
  }
}
*/ 