import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent } from "@dfinity/agent"

// Configuración de Internet Identity
const II_CONFIG = {
  applicationName: "DROPSLAND",
  applicationLogo: "https://dropsland.icp0.io/images/dropsland-logo.png",
  identityProvider: "https://identity.ic0.app",
}

// Inicializar el cliente de autenticación
let authClient: AuthClient | null = null

export const initAuth = async () => {
  if (!authClient) {
    authClient = await AuthClient.create()
  }
  return authClient
}

// Función para iniciar sesión con Internet Identity
export const loginWithII = async () => {
  try {
    const client = await initAuth()
    return new Promise((resolve, reject) => {
      client.login({
        identityProvider: II_CONFIG.identityProvider,
        onSuccess: () => {
          const identity = client.getIdentity()
          resolve(identity)
        },
        onError: (error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error("Error logging in with Internet Identity:", error)
    throw error
  }
}

// Función para cerrar sesión
export const logoutFromII = async () => {
  try {
    const client = await initAuth()
    await client.logout()
  } catch (error) {
    console.error("Error logging out from Internet Identity:", error)
    throw error
  }
}

// Función para verificar si el usuario está autenticado
export const isIIAuthenticated = async () => {
  try {
    const client = await initAuth()
    return await client.isAuthenticated()
  } catch (error) {
    return false
  }
}

// Función para obtener el agente HTTP autenticado
export const getAuthenticatedAgent = async () => {
  const client = await initAuth()
  const identity = client.getIdentity()
  return new HttpAgent({ identity })
} 