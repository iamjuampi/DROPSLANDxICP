"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { userDataService } from "@/lib/user-data-service"
import { backendService } from "@/lib/backend-service"
import { UserData } from "@/lib/types"

// Add user type to the interface
type UserType = "fan" | "artist"

interface AuthContextType {
  user: string | null
  userData: UserData | null
  isAuthenticated: boolean
  balance: number
  donated: number
  login: (username: string) => void
  loginWithNFID: (principal: string) => void
  logout: () => void
  updateBalance: (newBalance: number) => void
  addToBalance: (amount: number) => void
  addToDonated: (amount: number) => void
  isArtist: () => boolean
  isNFIDUser: () => boolean
  isFirstTimeNFIDUser: (principal: string) => boolean
  createNFIDUser: (principal: string, username: string, password: string, profilePhoto?: File) => boolean
  updateUserProfile: (updates: Partial<UserData>) => void
  updateBackendProfile: (username?: string, handle?: string, profileImage?: string, coverImage?: string, genre?: string, bio?: string) => Promise<boolean>
  updateBackendUsername: (username: string) => Promise<boolean>
  updateBackendHandle: (handle: string) => Promise<boolean>
  updateBackendProfileImage: (profileImage: string) => Promise<boolean>
  updateBackendCoverImage: (coverImage: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAuthenticated: false,
  balance: 0,
  donated: 0,
  login: () => {},
  loginWithNFID: () => {},
  logout: () => {},
  updateBalance: () => {},
  addToBalance: () => {},
  addToDonated: () => {},
  isArtist: () => false,
  isNFIDUser: () => false,
  isFirstTimeNFIDUser: () => false,
  createNFIDUser: () => false,
  updateUserProfile: () => {},
  updateBackendProfile: () => Promise.resolve(false),
  updateBackendUsername: () => Promise.resolve(false),
  updateBackendHandle: () => Promise.resolve(false),
  updateBackendProfileImage: () => Promise.resolve(false),
  updateBackendCoverImage: () => Promise.resolve(false),
})

// Legacy user data for backward compatibility
const USER_DATA: Record<string, Partial<UserData>> = {
  juampi: {
    username: "iamjuampi",
    type: "artist",
    isVerified: true,
    profilePhoto: "/avatars/juampi.jpg",
  },
  banger: {
    username: "banger",
    type: "artist",
    isVerified: true,
    profilePhoto: "/avatars/banger.jpg",
  },
  nicolamarti: {
    username: "Nicola Marti",
    type: "artist",
    isVerified: true,
    profilePhoto: "/avatars/nicola.jpg",
  },
  axs: {
    username: "AXS",
    type: "artist",
    isVerified: true,
    profilePhoto: "/avatars/axs.jpg",
  },
  flush: {
    username: "FLUSH",
    type: "artist",
    isVerified: false,
    profilePhoto: "/avatars/flush.jpg",
  },
  daniloDR: {
    username: "DaniløDR",
    type: "artist",
    isVerified: false,
    profilePhoto: "/avatars/danilo.jpg",
  },
  spitflux: {
    username: "Spitflux",
    type: "artist",
    isVerified: false,
    profilePhoto: "/avatars/spitflux.jpg",
  },
  kr4d: {
    username: "Kr4D",
    type: "artist",
    isVerified: false,
    profilePhoto: "/avatars/kr4d.jpg",
  },
  fan: {
    username: "musicfan",
    type: "fan",
    profilePhoto: "/avatars/user.jpg",
  },
  iamjuampi: {
    username: "iamjuampi",
    type: "artist",
    isVerified: true,
    profilePhoto: "/avatars/juampi.jpg",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(125)
  const [donated, setDonated] = useState(75)
  const [user, setUser] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("beans_user")
    if (storedUser) {
      setUser(storedUser)
      
      // Try to get user data from the service first by ID
      let serviceUserData = userDataService.getUser(storedUser)
      
      // If not found by ID, try to find by username
      if (!serviceUserData) {
        serviceUserData = userDataService.getUserByUsername(storedUser)
        
        // If found by username, use the correct user ID for future operations
        if (serviceUserData) {
          console.log(`Found user by username "${storedUser}", using ID: ${serviceUserData.id}`)
          setUser(serviceUserData.id) // Use the actual user ID instead of username
          localStorage.setItem("beans_user", serviceUserData.id) // Update localStorage with correct ID
        }
      }
      
      if (serviceUserData) {
        setUserData(serviceUserData)
        setIsAuthenticated(true)
      } else {
        // Fallback to legacy user data
        const legacyUserData = USER_DATA[storedUser]
        if (legacyUserData && legacyUserData.username && legacyUserData.type) {
          // Convert legacy user data to new format
          const newUserData: UserData = {
            id: storedUser,
            username: legacyUserData.username,
            type: legacyUserData.type as "fan" | "artist",
            isVerified: legacyUserData.isVerified,
            profilePhoto: legacyUserData.profilePhoto,
            isIIUser: legacyUserData.isIIUser,
            principal: legacyUserData.principal,
            followers: [],
            following: [],
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          }
          setUserData(newUserData)
          setIsAuthenticated(true)
        }
      }
      
      // Retrieve saved balance if it exists
      const storedBalance = localStorage.getItem("beans_balance")
      if (storedBalance) {
        setBalance(Number(storedBalance))
      }
      // Retrieve saved donated value if it exists
      const storedDonated = localStorage.getItem("beans_donated")
      if (storedDonated) {
        setDonated(Number(storedDonated))
      }
    }
  }, [])

  const login = useCallback((username: string) => {
    setUser(username)
    
    // Try to get user data from the service first by ID
    let serviceUserData = userDataService.getUser(username)
    
    // If not found by ID, try to find by username
    if (!serviceUserData) {
      serviceUserData = userDataService.getUserByUsername(username)
      
      // If found by username, use the correct user ID for future operations
      if (serviceUserData) {
        console.log(`Found user by username "${username}", using ID: ${serviceUserData.id}`)
        setUser(serviceUserData.id) // Use the actual user ID instead of username
      }
    }
    
    if (!serviceUserData) {
      // Create user in service if it doesn't exist
      const legacyUserData = USER_DATA[username]
      if (legacyUserData && legacyUserData.username && legacyUserData.type) {
        serviceUserData = userDataService.createUser({
          username: legacyUserData.username,
          type: legacyUserData.type as "fan" | "artist",
          isVerified: legacyUserData.isVerified,
          profilePhoto: legacyUserData.profilePhoto,
          isIIUser: legacyUserData.isIIUser,
          principal: legacyUserData.principal,
        })
        // Use the created user's ID
        setUser(serviceUserData.id)
      } else {
        // Create a new fan user
        serviceUserData = userDataService.createUser({
          username,
          type: "fan",
        })
        // Use the created user's ID
        setUser(serviceUserData.id)
      }
    }
    
    setUserData(serviceUserData)
    setIsAuthenticated(true)
    localStorage.setItem("beans_user", serviceUserData.id) // Store the actual user ID

    // Set initial balance if it doesn't exist
    if (!localStorage.getItem("beans_balance")) {
      localStorage.setItem("beans_balance", "125")
    }

    // Set initial donated value if it doesn't exist
    if (!localStorage.getItem("beans_donated")) {
      localStorage.setItem("beans_donated", "75")
    }
  }, [])

  const loginWithNFID = useCallback((principal: string) => {
    // Check if this NFID user already exists in the service
    let serviceUserData = userDataService.getUser(principal)
    if (serviceUserData) {
      setUser(principal)
      setUserData(serviceUserData)
      setIsAuthenticated(true)
      localStorage.setItem("beans_user", principal)
      
      // Set initial balance if it doesn't exist
      if (!localStorage.getItem("beans_balance")) {
        localStorage.setItem("beans_balance", "125")
      }

      // Set initial donated value if it doesn't exist
      if (!localStorage.getItem("beans_donated")) {
        localStorage.setItem("beans_donated", "75")
      }
    } else {
      // Check legacy storage
      const existingUser = localStorage.getItem(`nfid_user_${principal}`)
      if (existingUser) {
        const legacyUserData = JSON.parse(existingUser)
        // Convert to new format and create in service
        serviceUserData = userDataService.createUser({
          username: legacyUserData.username || principal,
          type: legacyUserData.type || "fan",
          isVerified: legacyUserData.isVerified,
          profilePhoto: legacyUserData.profilePhoto,
          isIIUser: true,
          principal,
        })
        
        setUser(principal)
        setUserData(serviceUserData)
        setIsAuthenticated(true)
        localStorage.setItem("beans_user", principal)
        
        // Set initial balance if it doesn't exist
        if (!localStorage.getItem("beans_balance")) {
          localStorage.setItem("beans_balance", "125")
        }

        // Set initial donated value if it doesn't exist
        if (!localStorage.getItem("beans_donated")) {
          localStorage.setItem("beans_donated", "75")
        }
      } else {
        // This is a first-time Internet Identity user - create them automatically
        const username = `user_${principal.slice(0, 8)}`
        serviceUserData = userDataService.createUser({
          username,
          type: "fan",
          isIIUser: true,
          principal,
          profilePhoto: "/avatars/user.jpg",
          bio: "¡Hola! Soy un fan de la música electrónica y me encanta descubrir nuevos artistas en DROPSLAND. Apoyo a mis artistas favoritos y disfruto de la comunidad de música underground.",
        })
        
        setUser(principal)
        setUserData(serviceUserData)
        setIsAuthenticated(true)
        localStorage.setItem("beans_user", principal)
        
        // Set initial balance
        localStorage.setItem("beans_balance", "125")
        localStorage.setItem("beans_donated", "75")
        
        console.log(`Created new user automatically: ${username} (${principal})`)
      }
    }
  }, [])

  const createNFIDUser = useCallback((principal: string, username: string, password: string, profilePhoto?: File) => {
    try {
      // If no principal is provided (direct signup), generate a temporary one
      const userPrincipal = principal || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Convert profile photo to base64 if provided
      const processPhoto = async (): Promise<string | undefined> => {
        if (!profilePhoto) return undefined
        
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(profilePhoto)
        })
      }

      // Process the photo and create user
      processPhoto().then((profilePhotoBase64) => {
        const newUserData = userDataService.createUser({
          username,
          type: "fan",
          isIIUser: true,
          principal: userPrincipal,
          profilePhoto: profilePhotoBase64,
        })

        // Store the password (in a real app, this should be hashed)
        localStorage.setItem(`nfid_password_${userPrincipal}`, password)

        // Set the user as authenticated
        setUser(userPrincipal)
        setUserData(newUserData)
        setIsAuthenticated(true)
        localStorage.setItem("beans_user", userPrincipal)

        // Set initial balance
        localStorage.setItem("beans_balance", "125")
        localStorage.setItem("beans_donated", "75")
      })

      return true
    } catch (error) {
      console.error("Error creating NFID user:", error)
      return false
    }
  }, [])

  const isFirstTimeNFIDUser = useCallback((principal: string) => {
    const serviceUser = userDataService.getUser(principal)
    if (serviceUser) return false
    
    const existingUser = localStorage.getItem(`nfid_user_${principal}`)
    return !existingUser
  }, [])

  const updateUserProfile = useCallback((updates: Partial<UserData>) => {
    if (!user) return
    
    const updatedUser = userDataService.updateUser(user, updates)
    if (updatedUser) {
      setUserData(updatedUser)
    }
  }, [user])

  const logout = () => {
    setUser(null)
    setUserData(null)
    setIsAuthenticated(false)
    localStorage.removeItem("beans_user")
    // We don't remove balance or donated value to keep them between sessions
  }

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance)
    localStorage.setItem("beans_balance", newBalance.toString())
  }

  const addToBalance = (amount: number) => {
    const newBalance = balance + amount
    setBalance(newBalance)
    localStorage.setItem("beans_balance", newBalance.toString())
  }

  const addToDonated = (amount: number) => {
    const newDonated = donated + amount
    setDonated(newDonated)
    localStorage.setItem("beans_donated", newDonated.toString())
  }

  const isArtist = () => {
    return userData?.type === "artist"
  }

  const isNFIDUser = () => {
    return userData?.isIIUser === true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated,
        balance,
        donated,
        login,
        loginWithNFID,
        logout,
        updateBalance,
        addToBalance,
        addToDonated,
        isArtist,
        isNFIDUser,
        isFirstTimeNFIDUser,
        createNFIDUser,
        updateUserProfile,
        updateBackendProfile: async (username, handle, profileImage, coverImage, genre, bio) => {
          console.log("Auth: updateBackendProfile called", { username, handle, profileImage, coverImage, genre, bio })
          if (!user) {
            console.log("Auth: No user found, returning false")
            return false;
          }
          
          try {
            console.log("Auth: Calling backendService.updateUserProfile")
            const result = await backendService.updateUserProfile(username, handle, profileImage, coverImage, genre, bio);
            console.log("Auth: backendService result", result)
            
            if (result.success) {
              console.log("Auth: Backend update successful, updating local user data")
              // Update local user data service
              const updatedUserData = userDataService.updateUser(user, {
                username: username || userData?.username,
                handle: handle || userData?.handle,
                profilePhoto: profileImage || userData?.profilePhoto,
                coverPhoto: coverImage || userData?.coverPhoto,
                genre: genre || userData?.genre,
                bio: bio || userData?.bio,
              });
              
              console.log("Auth: Updated user data", updatedUserData)
              
              // Update state
              if (updatedUserData) {
                setUserData(updatedUserData);
                console.log("Auth: State updated with new user data")
              }
              
              console.log("Profile updated successfully:", result.data);
            }
            return result.success;
          } catch (error) {
            console.error("Auth: Error updating profile:", error);
            return false;
          }
        },
        updateBackendUsername: async (username) => {
          if (!user) return false;
          const result = await backendService.updateUsername(username);
          if (result.success) {
            setUserData(prev => prev ? { ...prev, username } : null);
          }
          return result.success;
        },
        updateBackendHandle: async (handle) => {
          if (!user) return false;
          const result = await backendService.updateHandle(handle);
          if (result.success) {
            setUserData(prev => prev ? { ...prev, handle } : null);
          }
          return result.success;
        },
        updateBackendProfileImage: async (profileImage) => {
          if (!user) return false;
          const result = await backendService.updateProfileImage(profileImage);
          if (result.success) {
            setUserData(prev => prev ? { ...prev, profilePhoto: profileImage } : null);
          }
          return result.success;
        },
        updateBackendCoverImage: async (coverImage) => {
          if (!user) return false;
          const result = await backendService.updateCoverImage(coverImage);
          if (result.success) {
            setUserData(prev => prev ? { ...prev, coverPhoto: coverImage } : null);
          }
          return result.success;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

