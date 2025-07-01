import { IdentityKit } from "@nfid/identitykit"
import { HttpAgent } from "@dfinity/agent"

// Configuración de NFID
const NFID_CONFIG = {
  applicationName: "DROPSLAND",
  applicationLogo: "https://dropsland.icp0.io/images/dropsland-logo.png",
}

// Inicializar el cliente de NFID
let identityKit: IdentityKit | null = null

export const initNFID = async () => {
  if (!identityKit) {
    try {
      identityKit = new IdentityKit({
        applicationName: NFID_CONFIG.applicationName,
        applicationLogo: NFID_CONFIG.applicationLogo,
      })
    } catch (error) {
      console.error("Error initializing NFID:", error)
      throw new Error(`Failed to initialize NFID: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  return identityKit
}

// Función para iniciar sesión con NFID
export const loginWithNFID = async () => {
  try {
    const kit = await initNFID()
    const identity = await kit.login()
    return identity
  } catch (error) {
    console.error("Error logging in with NFID:", error)
    
    // Proporcionar mensajes de error más específicos
    if (error instanceof Error) {
      if (error.message.includes('crypto')) {
        throw new Error('NFID requires a secure connection (HTTPS) or localhost. Please ensure you are running on a secure environment.')
      }
      if (error.message.includes('network')) {
        throw new Error('Unable to connect to NFID. Please check your internet connection.')
      }
    }
    
    throw error
  }
}

// Función para cerrar sesión
export const logoutFromNFID = async () => {
  try {
    if (identityKit) {
      await identityKit.logout()
    }
  } catch (error) {
    console.error("Error logging out from NFID:", error)
    throw error
  }
}

// Función para verificar si el usuario está autenticado
export const isNFIDAuthenticated = async () => {
  try {
    if (identityKit) {
      return await identityKit.isAuthenticated()
    }
    return false
  } catch (error) {
    return false
  }
}

// Función para obtener el agente HTTP autenticado
export const getAuthenticatedAgent = async () => {
  if (identityKit) {
    const identity = await identityKit.getIdentity()
    return new HttpAgent({ identity })
  }
  throw new Error("NFID not initialized")
}

// Función para obtener la identidad actual
export const getCurrentIdentity = async () => {
  if (identityKit) {
    return await identityKit.getIdentity()
  }
  throw new Error("NFID not initialized")
} 