import { UserData, Post, Activity, Notification, Token, UserStats, FeedItem, PostComment } from './types'

class UserDataService {
  private users: Map<string, UserData> = new Map()
  private posts: Map<string, Post> = new Map()
  private activities: Map<string, Activity> = new Map()
  private notifications: Map<string, Notification[]> = new Map()
  private tokens: Map<string, Token> = new Map()
  private userStats: Map<string, UserStats> = new Map()

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultData()
  }

  private loadFromStorage() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') return
      
      const usersData = localStorage.getItem('dropsland_users')
      if (usersData) {
        const users = JSON.parse(usersData)
        this.users = new Map(Object.entries(users))
      }

      const postsData = localStorage.getItem('dropsland_posts')
      if (postsData) {
        const posts = JSON.parse(postsData)
        this.posts = new Map(Object.entries(posts))
      }

      const activitiesData = localStorage.getItem('dropsland_activities')
      if (activitiesData) {
        const activities = JSON.parse(activitiesData)
        this.activities = new Map(Object.entries(activities))
      }

      const notificationsData = localStorage.getItem('dropsland_notifications')
      if (notificationsData) {
        const notifications = JSON.parse(notificationsData)
        this.notifications = new Map(Object.entries(notifications))
      }

      const tokensData = localStorage.getItem('dropsland_tokens')
      if (tokensData) {
        const tokens = JSON.parse(tokensData)
        this.tokens = new Map(Object.entries(tokens))
      }

      const statsData = localStorage.getItem('dropsland_user_stats')
      if (statsData) {
        const stats = JSON.parse(statsData)
        this.userStats = new Map(Object.entries(stats))
      }
    } catch (error) {
      console.error('Error loading data from storage:', error)
    }
  }

  private saveToStorage() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') return
      
      localStorage.setItem('dropsland_users', JSON.stringify(Object.fromEntries(this.users)))
      localStorage.setItem('dropsland_posts', JSON.stringify(Object.fromEntries(this.posts)))
      localStorage.setItem('dropsland_activities', JSON.stringify(Object.fromEntries(this.activities)))
      localStorage.setItem('dropsland_notifications', JSON.stringify(Object.fromEntries(this.notifications)))
      localStorage.setItem('dropsland_tokens', JSON.stringify(Object.fromEntries(this.tokens)))
      localStorage.setItem('dropsland_user_stats', JSON.stringify(Object.fromEntries(this.userStats)))
    } catch (error) {
      console.error('Error saving data to storage:', error)
    }
  }

  private initializeDefaultData() {
    // Initialize default users if they don't exist
    const defaultUsers: UserData[] = [
      {
        id: 'juampi',
        username: 'iamjuampi',
        type: 'artist',
        profilePhoto: '/avatars/juampi.jpg',
        bio: 'Techno producer and DJ from Argentina. Creating dark, industrial sounds that move the dance floor.',
        genre: 'Techno',
        location: 'Buenos Aires, Argentina',
        website: 'https://iamjuampi.com',
        socialLinks: {
          twitter: '@iamjuampi',
          instagram: '@iamjuampi',
          youtube: 'iamjuampi',
          spotify: 'iamjuampi'
        },
        followers: ['banger', 'nicolamarti', 'fan'],
        following: ['banger', 'nicolamarti'],
        createdAt: '2024-01-01T00:00:00Z',
        lastActive: new Date().toISOString()
      },
      {
        id: 'banger',
        username: 'banger',
        type: 'artist',
        profilePhoto: '/avatars/banger.jpg',
        bio: 'Techno DJ and producer pushing the boundaries of electronic music. Known for high-energy sets and innovative productions.',
        genre: 'Techno',
        location: 'Berlin, Germany',
        website: 'https://banger-music.com',
        socialLinks: {
          twitter: '@banger_music',
          instagram: '@banger_music',
          youtube: 'banger_music',
          spotify: 'banger'
        },
        followers: ['juampi', 'nicolamarti', 'fan'],
        following: ['juampi', 'nicolamarti'],
        createdAt: '2024-01-02T00:00:00Z',
        lastActive: new Date().toISOString()
      },
      {
        id: 'nicolamarti',
        username: 'Nicola Marti',
        type: 'artist',
        profilePhoto: '/avatars/nicola.jpg',
        bio: 'House music producer and DJ. Creating soulful, groovy tracks that make you move.',
        genre: 'House',
        location: 'Amsterdam, Netherlands',
        website: 'https://nicolamarti.com',
        socialLinks: {
          twitter: '@nicolamarti',
          instagram: '@nicolamarti',
          youtube: 'nicolamarti',
          spotify: 'nicola_marti'
        },
        followers: ['juampi', 'banger', 'fan'],
        following: ['juampi', 'banger'],
        createdAt: '2024-01-03T00:00:00Z',
        lastActive: new Date().toISOString()
      },
      {
        id: 'axs',
        username: 'AXS',
        type: 'artist',
        profilePhoto: '/avatars/axs.jpg',
        bio: 'UK techno producer and DJ. Pushing the boundaries of underground electronic music.',
        genre: 'Techno',
        location: 'Manchester, UK',
        website: 'https://axs-music.com',
        socialLinks: {
          twitter: '@axs_music',
          instagram: '@axs_music',
          youtube: 'axs_music',
          spotify: 'axs'
        },
        followers: ['juampi', 'banger', 'nicolamarti', 'fan'],
        following: ['juampi', 'banger', 'nicolamarti'],
        createdAt: '2024-01-04T00:00:00Z',
        lastActive: new Date().toISOString()
      },
      {
        id: 'fan',
        username: 'musicfan',
        type: 'fan',
        profilePhoto: '/avatars/user.jpg',
        bio: 'Music enthusiast and electronic music fan. Supporting my favorite artists on DROPSLAND.',
        followers: [],
        following: ['juampi', 'banger', 'nicolamarti', 'axs'],
        createdAt: '2024-03-01T00:00:00Z',
        lastActive: new Date().toISOString()
      }
    ]

    defaultUsers.forEach(user => {
      if (!this.users.has(user.id)) {
        this.users.set(user.id, user)
      }
    })

    // Initialize default posts
    const defaultPosts: Post[] = [
      {
        id: 'post1',
        authorId: 'juampi',
        authorName: 'iamjuampi',
        authorAvatar: '/avatars/juampi.jpg',
        content: 'Just released my new EP "Techno Dimensions"! Available now on all platforms. This one took me 6 months to perfect. #TechnoDimensions #NewRelease #Techno',
        image: '/images/bdeeeee.jpg',
        likes: ['banger', 'nicolamarti', 'fan'],
        comments: [
          {
            id: 'comment1',
            authorId: 'banger',
            authorName: 'banger',
            authorAvatar: '/avatars/banger.jpg',
            content: 'Sounds absolutely fire! 🔥 The production quality is insane',
            createdAt: '2024-01-15T10:30:00Z',
            likes: ['juampi', 'fan']
          },
          {
            id: 'comment2',
            authorId: 'nicolamarti',
            authorName: 'Nicola Marti',
            authorAvatar: '/avatars/nicola.jpg',
            content: 'Congrats on the release! The track "Midnight Pulse" is my favorite',
            createdAt: '2024-01-15T11:15:00Z',
            likes: ['juampi']
          }
        ],
        createdAt: '2024-01-15T09:00:00Z',
        type: 'post',
        tags: ['techno', 'newrelease', 'ep']
      },
      {
        id: 'post2',
        authorId: 'banger',
        authorName: 'banger',
        authorAvatar: '/avatars/banger.jpg',
        content: 'Studio session with @nicolamarti today! Working on a collab that\'s going to blow your minds. Two different styles coming together in the most beautiful way. #StudioSession #Collab #TechnoHouse',
        image: '/images/dj-mixer.png',
        likes: ['juampi', 'nicolamarti', 'fan'],
        comments: [
          {
            id: 'comment3',
            authorId: 'juampi',
            authorName: 'iamjuampi',
            authorAvatar: '/avatars/juampi.jpg',
            content: 'Can\'t wait to hear this! 🔥',
            createdAt: '2024-01-16T14:20:00Z',
            likes: ['banger']
          }
        ],
        createdAt: '2024-01-16T14:00:00Z',
        type: 'post',
        tags: ['studiosession', 'collab', 'technohouse']
      },
      {
        id: 'post3',
        authorId: 'nicolamarti',
        authorName: 'Nicola Marti',
        authorAvatar: '/avatars/nicola.jpg',
        content: 'Preparing my set for this weekend at Club Underground. It\'s going to be an epic night of techno and house. Who\'s coming? 🎧 #ClubUnderground #LiveSet #Techno',
        likes: ['juampi', 'banger', 'fan'],
        comments: [
          {
            id: 'comment4',
            authorId: 'fan',
            authorName: 'musicfan',
            authorAvatar: '/avatars/user.jpg',
            content: 'I\'ll be there! Can\'t wait to hear your new tracks live',
            createdAt: '2024-01-17T16:45:00Z',
            likes: ['nicolamarti']
          }
        ],
        createdAt: '2024-01-17T16:00:00Z',
        type: 'post',
        tags: ['clubunderground', 'liveset', 'techno']
      },
      {
        id: 'post4',
        authorId: 'juampi',
        authorName: 'iamjuampi',
        authorAvatar: '/avatars/juampi.jpg',
        content: 'Happy to announce I\'ll be playing at the Electronic Dreams festival next month! This is going to be huge. See you there! #ElectronicDreams #Festival #Techno',
        image: '/images/bdeeeee.jpg',
        likes: ['banger', 'nicolamarti', 'fan'],
        comments: [],
        createdAt: '2024-01-18T12:30:00Z',
        type: 'announcement',
        tags: ['electronicdreams', 'festival', 'techno']
      },
      {
        id: 'post5',
        authorId: 'banger',
        authorName: 'banger',
        authorAvatar: '/avatars/banger.jpg',
        content: 'Working on new sounds for my upcoming release. I\'m experimenting with analog synthesizers and 90s samples. The results are mind-blowing! #AnalogSynths #90sSamples #NewSounds',
        likes: ['juampi', 'fan'],
        comments: [
          {
            id: 'comment5',
            authorId: 'juampi',
            authorName: 'iamjuampi',
            authorAvatar: '/avatars/juampi.jpg',
            content: 'Analog synths are the way to go! What gear are you using?',
            createdAt: '2024-01-19T10:15:00Z',
            likes: ['banger']
          }
        ],
        createdAt: '2024-01-19T09:30:00Z',
        type: 'post',
        tags: ['analogsynths', '90ssamples', 'newsounds']
      },
      {
        id: 'post6',
        authorId: 'nicolamarti',
        authorName: 'Nicola Marti',
        authorAvatar: '/avatars/nicola.jpg',
        content: 'Just finished mastering the collaboration with @banger - two different worlds colliding in the most beautiful way. This track is going to be special. #Collab #Mastering #NewTrack',
        likes: ['juampi', 'banger', 'fan'],
        comments: [],
        createdAt: '2024-01-20T15:45:00Z',
        type: 'post',
        tags: ['collab', 'mastering', 'newtrack']
      },
      {
        id: 'post7',
        authorId: 'juampi',
        authorName: 'iamjuampi',
        authorAvatar: '/avatars/juampi.jpg',
        content: 'Vinyl lovers! Limited edition 12" of "Techno Dimensions" coming next week. Only 200 copies available worldwide. Pre-order link in bio. #Vinyl #LimitedEdition #Techno',
        image: '/images/dj-mixer.png',
        likes: ['banger', 'nicolamarti', 'fan'],
        comments: [
          {
            id: 'comment6',
            authorId: 'fan',
            authorName: 'musicfan',
            authorAvatar: '/avatars/user.jpg',
            content: 'Already pre-ordered! Can\'t wait to have this on vinyl',
            createdAt: '2024-01-21T11:30:00Z',
            likes: ['juampi']
          }
        ],
        createdAt: '2024-01-21T10:00:00Z',
        type: 'announcement',
        tags: ['vinyl', 'limitededition', 'techno']
      },
      {
        id: 'post8',
        authorId: 'banger',
        authorName: 'banger',
        authorAvatar: '/avatars/banger.jpg',
        content: 'Throwback to my Ibiza set last summer. Still can\'t believe how amazing that crowd was! The energy was electric. #Ibiza #Throwback #HouseMusic',
        image: '/images/bdeeeee.jpg',
        likes: ['juampi', 'nicolamarti', 'fan'],
        comments: [],
        createdAt: '2024-01-22T18:20:00Z',
        type: 'post',
        tags: ['ibiza', 'throwback', 'housemusic']
      },
      // Nuevos posts más recientes
      {
        id: 'post9',
        authorId: 'axs',
        authorName: 'AXS',
        authorAvatar: '/avatars/axs.jpg',
        content: 'New track "Neon Nights" dropping this Friday! This one is pure techno energy. Can\'t wait to share it with you all. #NeonNights #NewTrack #Techno',
        likes: ['juampi', 'banger', 'fan'],
        comments: [
          {
            id: 'comment7',
            authorId: 'juampi',
            authorName: 'iamjuampi',
            authorAvatar: '/avatars/juampi.jpg',
            content: 'Been waiting for this! Your sound is always on point 🔥',
            createdAt: '2024-01-23T09:15:00Z',
            likes: ['axs']
          }
        ],
        createdAt: '2024-01-23T08:00:00Z',
        type: 'post',
        tags: ['neonnights', 'newtrack', 'techno']
      },
      {
        id: 'post10',
        authorId: 'juampi',
        authorName: 'iamjuampi',
        authorAvatar: '/avatars/juampi.jpg',
        content: 'Studio vibes today. Working on something special for my next release. The energy in here is incredible right now. #StudioVibes #NewMusic #Techno',
        image: '/images/dj-mixer.png',
        likes: ['banger', 'nicolamarti', 'axs', 'fan'],
        comments: [],
        createdAt: '2024-01-24T14:30:00Z',
        type: 'post',
        tags: ['studiovibes', 'newmusic', 'techno']
      },
      {
        id: 'post11',
        authorId: 'nicolamarti',
        authorName: 'Nicola Marti',
        authorAvatar: '/avatars/nicola.jpg',
        content: 'Just got back from my European tour! The response was incredible. Thank you to everyone who came out. Special shoutout to Berlin - you know how to party! #EuropeanTour #Berlin #HouseMusic',
        likes: ['juampi', 'banger', 'axs', 'fan'],
        comments: [
          {
            id: 'comment8',
            authorId: 'banger',
            authorName: 'banger',
            authorAvatar: '/avatars/banger.jpg',
            content: 'Berlin crowds are the best! Welcome back 🔥',
            createdAt: '2024-01-25T11:20:00Z',
            likes: ['nicolamarti']
          }
        ],
        createdAt: '2024-01-25T10:00:00Z',
        type: 'post',
        tags: ['europeantour', 'berlin', 'housemusic']
      },
      {
        id: 'post12',
        authorId: 'banger',
        authorName: 'banger',
        authorAvatar: '/avatars/banger.jpg',
        content: 'New remix for @axs "Neon Nights" is ready! This one goes hard. Check it out on my SoundCloud. #Remix #NeonNights #Techno',
        likes: ['juampi', 'nicolamarti', 'axs', 'fan'],
        comments: [
          {
            id: 'comment9',
            authorId: 'axs',
            authorName: 'AXS',
            authorAvatar: '/avatars/axs.jpg',
            content: 'This remix is absolutely insane! 🔥🔥🔥',
            createdAt: '2024-01-26T16:45:00Z',
            likes: ['banger']
          }
        ],
        createdAt: '2024-01-26T15:00:00Z',
        type: 'post',
        tags: ['remix', 'neonnights', 'techno']
      },
      {
        id: 'post13',
        authorId: 'axs',
        authorName: 'AXS',
        authorAvatar: '/avatars/axs.jpg',
        content: 'Playing at Warehouse Project this weekend! Manchester, are you ready for some techno? This is going to be epic. #WarehouseProject #Manchester #Techno',
        likes: ['juampi', 'banger', 'nicolamarti', 'fan'],
        comments: [],
        createdAt: '2024-01-27T12:00:00Z',
        type: 'announcement',
        tags: ['warehouseproject', 'manchester', 'techno']
      },
      {
        id: 'post14',
        authorId: 'juampi',
        authorName: 'iamjuampi',
        authorAvatar: '/avatars/juampi.jpg',
        content: 'Just finished a 4-hour studio session. The new track is taking shape and it\'s sounding massive. Sometimes you just know when you\'ve got something special. #StudioSession #NewTrack #Techno',
        likes: ['banger', 'nicolamarti', 'axs', 'fan'],
        comments: [
          {
            id: 'comment10',
            authorId: 'fan',
            authorName: 'musicfan',
            authorAvatar: '/avatars/user.jpg',
            content: 'Can\'t wait to hear it! Your tracks always hit different 🔥',
            createdAt: '2024-01-28T19:30:00Z',
            likes: ['juampi']
          }
        ],
        createdAt: '2024-01-28T18:00:00Z',
        type: 'post',
        tags: ['studiosession', 'newtrack', 'techno']
      },
      {
        id: 'post15',
        authorId: 'nicolamarti',
        authorName: 'Nicola Marti',
        authorAvatar: '/avatars/nicola.jpg',
        content: 'New podcast episode is live! This week I\'m sharing some of my favorite tracks and talking about the future of house music. Link in bio. #Podcast #HouseMusic #NewEpisode',
        likes: ['juampi', 'banger', 'axs', 'fan'],
        comments: [],
        createdAt: '2024-01-29T20:00:00Z',
        type: 'post',
        tags: ['podcast', 'housemusic', 'newepisode']
      }
    ]

    defaultPosts.forEach(post => {
      if (!this.posts.has(post.id)) {
        this.posts.set(post.id, post)
      }
    })

    console.log('After adding default posts, total posts:', this.posts.size)
    console.log('Default posts added:', defaultPosts.length)

    // Initialize default tokens
    const defaultTokens: Token[] = [
      {
        id: 'juampi_token',
        name: 'JUAMPI Token',
        symbol: 'JUAMPI',
        artistId: 'juampi',
        artistName: 'iamjuampi',
        price: 0.50,
        totalSupply: 10000,
        circulatingSupply: 5000,
        description: 'Official token for iamjuampi artist',
        image: '/avatars/juampi.jpg'
      },
      {
        id: 'banger_token',
        name: 'BANGER Token',
        symbol: 'BANGER',
        artistId: 'banger',
        artistName: 'banger',
        price: 0.30,
        totalSupply: 8000,
        circulatingSupply: 3000,
        description: 'Official token for banger artist',
        image: '/avatars/banger.jpg'
      }
    ]

    defaultTokens.forEach(token => {
      if (!this.tokens.has(token.id)) {
        this.tokens.set(token.id, token)
      }
    })

    // Initialize user stats
    defaultUsers.forEach(user => {
      if (!this.userStats.has(user.id)) {
        this.userStats.set(user.id, {
          followers: user.followers.length,
          following: user.following.length,
          posts: this.getPostsByUser(user.id).length,
          tokensOwned: 0,
          totalValue: 0,
          totalDonated: 0
        })
      }
    })

    this.saveToStorage()
  }

  // User methods
  getUser(userId: string): UserData | null {
    return this.users.get(userId) || null
  }

  getUserByPrincipal(principal: string): UserData | null {
    for (const user of this.users.values()) {
      if (user.principal === principal) {
        return user
      }
    }
    return null
  }

  getUserByUsername(username: string): UserData | null {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user
      }
    }
    return null
  }

  getAllUsers(): UserData[] {
    return Array.from(this.users.values())
  }

  createUser(userData: Omit<UserData, 'id' | 'createdAt' | 'lastActive' | 'followers' | 'following'>): UserData {
    const id = userData.principal || `user_${Date.now()}`
    const newUser: UserData = {
      ...userData,
      id,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }

    this.users.set(id, newUser)
    this.userStats.set(id, {
      followers: 0,
      following: 0,
      posts: 0,
      tokensOwned: 0,
      totalValue: 0,
      totalDonated: 0
    })

    this.saveToStorage()
    return newUser
  }

  updateUser(userId: string, updates: Partial<UserData>): UserData | null {
    const user = this.users.get(userId)
    if (!user) return null

    const updatedUser = { ...user, ...updates, lastActive: new Date().toISOString() }
    this.users.set(userId, updatedUser)
    this.saveToStorage()
    return updatedUser
  }

  // Post methods
  createPost(postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Post {
    const id = `post_${Date.now()}`
    const newPost: Post = {
      ...postData,
      id,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }

    this.posts.set(id, newPost)
    this.updateUserStats(postData.authorId)
    this.saveToStorage()
    return newPost
  }

  getPostsByUser(userId: string): Post[] {
    return Array.from(this.posts.values()).filter(post => post.authorId === userId)
  }

  getFeedForUser(userId: string): FeedItem[] {
    const user = this.users.get(userId)
    
    if (!user) {
      return []
    }

    const followingIds = user.following
    
    // If user is not following anyone, show posts from featured artists
    let postFilter = (post: Post) => followingIds.includes(post.authorId) || post.authorId === userId
    
    if (followingIds.length === 0) {
      // Show posts from featured artists for new users
      const featuredArtistIds = ['juampi', 'banger', 'nicolamarti', 'axs']
      postFilter = (post: Post) => featuredArtistIds.includes(post.authorId) || post.authorId === userId
    }
    
    const allPosts = Array.from(this.posts.values())
    
    const userPosts = allPosts
      .filter(postFilter)
      .map(post => ({
        id: `feed_${post.id}`,
        type: 'post' as const,
        data: post,
        priority: 1,
        createdAt: post.createdAt
      }))

    const userActivities = Array.from(this.activities.values())
      .filter(activity => followingIds.includes(activity.userId) || activity.userId === userId)
      .map(activity => ({
        id: `feed_${activity.id}`,
        type: 'activity' as const,
        data: activity,
        priority: 2,
        createdAt: activity.createdAt
      }))

    const result = [...userPosts, ...userActivities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return result
  }

  // Activity methods
  createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'isRead'>): Activity {
    const id = `activity_${Date.now()}`
    const newActivity: Activity = {
      ...activityData,
      id,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    this.activities.set(id, newActivity)
    this.saveToStorage()
    return newActivity
  }

  getActivitiesForUser(userId: string): Activity[] {
    const user = this.users.get(userId)
    if (!user) return []

    return Array.from(this.activities.values())
      .filter(activity => 
        activity.userId === userId || 
        activity.targetUserId === userId ||
        (user.type === 'artist' && activity.relatedTo === 'artist') ||
        (user.type === 'fan' && activity.relatedTo === 'fan')
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Notification methods
  createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
    const id = `notification_${Date.now()}`
    const newNotification: Notification = {
      ...notificationData,
      id,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    const userNotifications = this.notifications.get(notificationData.targetUserId || '') || []
    userNotifications.unshift(newNotification)
    this.notifications.set(notificationData.targetUserId || '', userNotifications)
    this.saveToStorage()
    return newNotification
  }

  getNotificationsForUser(userId: string): Notification[] {
    return this.notifications.get(userId) || []
  }

  markNotificationAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || []
    const updatedNotifications = userNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    )
    this.notifications.set(userId, updatedNotifications)
    this.saveToStorage()
  }

  // Follow/Unfollow methods
  followUser(followerId: string, targetUserId: string): boolean {
    const follower = this.users.get(followerId)
    const target = this.users.get(targetUserId)
    
    if (!follower || !target || followerId === targetUserId) return false

    if (!follower.following.includes(targetUserId)) {
      follower.following.push(targetUserId)
      target.followers.push(followerId)
      
      this.users.set(followerId, follower)
      this.users.set(targetUserId, target)
      
      // Create activity and notification
      this.createActivity({
        type: 'follow',
        userId: followerId,
        userName: follower.username,
        userAvatar: follower.profilePhoto || '/avatars/user.jpg',
        action: 'started following you',
        relatedTo: 'artist',
        targetUserId
      })

      this.createNotification({
        type: 'follow',
        userId: followerId,
        userName: follower.username,
        userAvatar: follower.profilePhoto || '/avatars/user.jpg',
        message: `${follower.username} started following you`,
        targetUserId
      })

      this.updateUserStats(followerId)
      this.updateUserStats(targetUserId)
      this.saveToStorage()
      return true
    }

    return false
  }

  unfollowUser(followerId: string, targetUserId: string): boolean {
    const follower = this.users.get(followerId)
    const target = this.users.get(targetUserId)
    
    if (!follower || !target) return false

    const followerIndex = follower.following.indexOf(targetUserId)
    const targetIndex = target.followers.indexOf(followerId)

    if (followerIndex > -1 && targetIndex > -1) {
      follower.following.splice(followerIndex, 1)
      target.followers.splice(targetIndex, 1)
      
      this.users.set(followerId, follower)
      this.users.set(targetUserId, target)
      
      this.updateUserStats(followerId)
      this.updateUserStats(targetUserId)
      this.saveToStorage()
      return true
    }

    return false
  }

  // Like/Unlike methods
  likePost(userId: string, postId: string): boolean {
    const post = this.posts.get(postId)
    const user = this.users.get(userId)
    
    if (!post || !user) return false

    if (!post.likes.includes(userId)) {
      post.likes.push(userId)
      this.posts.set(postId, post)
      
      // Create activity and notification
      this.createActivity({
        type: 'like',
        userId,
        userName: user.username,
        userAvatar: user.profilePhoto || '/avatars/user.jpg',
        action: 'liked your post',
        relatedTo: 'artist',
        targetUserId: post.authorId,
        targetPostId: postId
      })

      if (post.authorId !== userId) {
        this.createNotification({
          type: 'like',
          userId,
          userName: user.username,
          userAvatar: user.profilePhoto || '/avatars/user.jpg',
          message: `${user.username} liked your post`,
          targetUserId: post.authorId,
          targetPostId: postId
        })
      }

      this.saveToStorage()
      return true
    }

    return false
  }

  unlikePost(userId: string, postId: string): boolean {
    const post = this.posts.get(postId)
    if (!post) return false

    const likeIndex = post.likes.indexOf(userId)
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1)
      this.posts.set(postId, post)
      this.saveToStorage()
      return true
    }

    return false
  }

  // Comment methods
  addComment(userId: string, postId: string, content: string): PostComment | null {
    const post = this.posts.get(postId)
    const user = this.users.get(userId)
    
    if (!post || !user) return null

    const comment: PostComment = {
      id: `comment_${Date.now()}`,
      authorId: userId,
      authorName: user.username,
      authorAvatar: user.profilePhoto || '/avatars/user.jpg',
      content,
      createdAt: new Date().toISOString(),
      likes: []
    }

    post.comments.push(comment)
    this.posts.set(postId, post)
    
    // Create activity and notification
    this.createActivity({
      type: 'comment',
      userId,
      userName: user.username,
      userAvatar: user.profilePhoto || '/avatars/user.jpg',
      action: 'commented on your post',
      message: content,
      relatedTo: 'artist',
      targetUserId: post.authorId,
      targetPostId: postId
    })

    if (post.authorId !== userId) {
      this.createNotification({
        type: 'comment',
        userId,
        userName: user.username,
        userAvatar: user.profilePhoto || '/avatars/user.jpg',
        message: `${user.username} commented on your post`,
        targetUserId: post.authorId,
        targetPostId: postId
      })
    }

    this.saveToStorage()
    return comment
  }

  // Token methods
  getTokensByArtist(artistId: string): Token[] {
    return Array.from(this.tokens.values()).filter(token => token.artistId === artistId)
  }

  getAllTokens(): Token[] {
    return Array.from(this.tokens.values())
  }

  // Stats methods
  getUserStats(userId: string): UserStats | null {
    return this.userStats.get(userId) || null
  }

  private updateUserStats(userId: string): void {
    const user = this.users.get(userId)
    if (!user) return

    const stats: UserStats = {
      followers: user.followers.length,
      following: user.following.length,
      posts: this.getPostsByUser(userId).length,
      tokensOwned: 0, // This would be calculated from token ownership
      totalValue: 0, // This would be calculated from token values
      totalDonated: 0 // This would be calculated from donation history
    }

    this.userStats.set(userId, stats)
  }

  // Search methods
  searchUsers(query: string): UserData[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.users.values()).filter(user =>
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.bio?.toLowerCase().includes(lowercaseQuery) ||
      user.genre?.toLowerCase().includes(lowercaseQuery)
    )
  }

  searchPosts(query: string): Post[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.posts.values()).filter(post =>
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }
}

// Export singleton instance
export const userDataService = new UserDataService()