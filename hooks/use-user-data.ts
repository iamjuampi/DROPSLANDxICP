import { useState, useEffect, useCallback } from 'react'
import { userDataService } from '@/lib/user-data-service'
import { UserData, Post, Activity, Notification, UserStats, FeedItem } from '@/lib/types'
import { useAuth } from './use-auth'

export function useUserData() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])

  // Load user data
  const loadUserData = useCallback(() => {
    if (!user) return
    
    const data = userDataService.getUser(user)
    const stats = userDataService.getUserStats(user)
    const userPosts = userDataService.getPostsByUser(user)
    const userActivities = userDataService.getActivitiesForUser(user)
    const userNotifications = userDataService.getNotificationsForUser(user)
    const userFeed = userDataService.getFeedForUser(user)

    setUserData(data)
    setUserStats(stats)
    setPosts(userPosts)
    setActivities(userActivities)
    setNotifications(userNotifications)
    setFeed(userFeed)
  }, [user])

  // Refresh all data
  const refreshData = useCallback(() => {
    loadUserData()
  }, [loadUserData])

  // Follow a user
  const followUser = useCallback((targetUserId: string) => {
    if (!user) return false
    
    const success = userDataService.followUser(user, targetUserId)
    if (success) {
      refreshData()
    }
    return success
  }, [user, refreshData])

  // Unfollow a user
  const unfollowUser = useCallback((targetUserId: string) => {
    if (!user) return false
    
    const success = userDataService.unfollowUser(user, targetUserId)
    if (success) {
      refreshData()
    }
    return success
  }, [user, refreshData])

  // Like a post
  const likePost = useCallback((postId: string) => {
    if (!user) return false
    
    const success = userDataService.likePost(user, postId)
    if (success) {
      refreshData()
    }
    return success
  }, [user, refreshData])

  // Unlike a post
  const unlikePost = useCallback((postId: string) => {
    if (!user) return false
    
    const success = userDataService.unlikePost(user, postId)
    if (success) {
      refreshData()
    }
    return success
  }, [user, refreshData])

  // Add a comment
  const addComment = useCallback((postId: string, content: string) => {
    if (!user) return null
    
    const comment = userDataService.addComment(user, postId, content)
    if (comment) {
      refreshData()
    }
    return comment
  }, [user, refreshData])

  // Create a post
  const createPost = useCallback((postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const post = userDataService.createPost(postData)
    if (post) {
      refreshData()
    }
    return post
  }, [refreshData])

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    if (!user) return
    
    userDataService.markNotificationAsRead(user, notificationId)
    refreshData()
  }, [user, refreshData])

  // Search users
  const searchUsers = useCallback((query: string) => {
    return userDataService.searchUsers(query)
  }, [])

  // Search posts
  const searchPosts = useCallback((query: string) => {
    return userDataService.searchPosts(query)
  }, [])

  // Get user by ID
  const getUser = useCallback((userId: string) => {
    return userDataService.getUser(userId)
  }, [])

  // Get user stats
  const getUserStats = useCallback((userId: string) => {
    return userDataService.getUserStats(userId)
  }, [])

  // Get posts by user
  const getPostsByUser = useCallback((userId: string) => {
    return userDataService.getPostsByUser(userId)
  }, [])

  // Get tokens by artist
  const getTokensByArtist = useCallback((artistId: string) => {
    return userDataService.getTokensByArtist(artistId)
  }, [])

  // Get all tokens
  const getAllTokens = useCallback(() => {
    return userDataService.getAllTokens()
  }, [])

  // Load data on mount and when user changes
  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  return {
    // Data
    userData,
    userStats,
    posts,
    activities,
    notifications,
    feed,
    
    // Actions
    refreshData,
    followUser,
    unfollowUser,
    likePost,
    unlikePost,
    addComment,
    createPost,
    markNotificationAsRead,
    
    // Search
    searchUsers,
    searchPosts,
    
    // Getters
    getUser,
    getUserStats,
    getPostsByUser,
    getTokensByArtist,
    getAllTokens,
  }
} 