export type UserType = "fan" | "artist"

export interface UserData {
  id: string
  username: string
  handle?: string  // @username
  type: UserType
  isVerified?: boolean
  profilePhoto?: string
  coverPhoto?: string  // Cover image
  isIIUser?: boolean
  principal?: string
  bio?: string
  genre?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    youtube?: string
    spotify?: string
  }
  followers: string[]
  following: string[]
  createdAt: string
  lastActive: string
  // Artist-specific fields
  posts?: Post[]
  supporters?: number
  blgReceived?: number
  tokenName?: string
  tokenPrice?: number
  featured?: boolean
}

export interface Post {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  image?: string
  likes: string[]
  comments: PostComment[]
  createdAt: string
  type: "post" | "release" | "announcement"
  tags?: string[]
}

export interface PostComment {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: string[]
}

export interface Activity {
  id: string
  type: "purchase" | "mention" | "reward" | "follow" | "like" | "comment" | "release"
  userId: string
  userName: string
  userAvatar: string
  action: string
  message?: string
  amount?: number
  tokenName?: string
  createdAt: string
  relatedTo: "artist" | "fan"
  targetUserId?: string
  targetPostId?: string
  isRead: boolean
}

export interface Notification {
  id: string
  type: "follow" | "like" | "comment" | "mention" | "purchase" | "reward"
  userId: string
  userName: string
  userAvatar: string
  message: string
  createdAt: string
  isRead: boolean
  targetPostId?: string
  targetUserId?: string
}

export interface Token {
  id: string
  name: string
  symbol: string
  artistId: string
  artistName: string
  price: number
  totalSupply: number
  circulatingSupply: number
  description: string
  image?: string
}

export interface UserStats {
  followers: number
  following: number
  posts: number
  tokensOwned: number
  totalValue: number
  totalDonated: number
}

export interface FeedItem {
  id: string
  type: "post" | "activity" | "release"
  data: Post | Activity
  priority: number
  createdAt: string
} 