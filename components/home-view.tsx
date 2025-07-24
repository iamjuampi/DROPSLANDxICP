"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, Send, Plus, ImageIcon, Video, MapPin, Hash, BarChart2, Paperclip, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { useAuth } from "@/hooks/use-auth"
import { userDataService } from "@/lib/user-data-service"
import { Post, Activity, FeedItem, UserData } from "@/lib/types"
import MusicPlayer from "@/components/music-player"
import MusicCard from "@/components/music-card"

interface HomeViewProps {
  onSelectArtist: (artistId: string) => void
  onNavigateToExplore?: () => void
}

export default function HomeView({ onSelectArtist, onNavigateToExplore }: HomeViewProps) {
  const { userData, isArtist, user } = useAuth()
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [currentPostId, setCurrentPostId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostImage, setNewPostImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true) // Add state for welcome banner visibility

  // Load feed data
  useEffect(() => {
    if (user) {
      const feed = userDataService.getFeedForUser(user)
      setFeedItems(feed)
    }
  }, [user])

  // Sample tracks for the popular section
  const popularTracks = [
    {
      id: "1",
      title: "The Less I Know the Better",
      artist: "Tame Impala",
      album: "Currents",
      duration: 219,
      cover: "/avatars/juampi.jpg",
      isLiked: false
    },
    {
      id: "2",
      title: "Pieces",
      artist: "Villagers",
      album: "Becoming a Jackal",
      duration: 325,
      cover: "/avatars/banger.jpg",
      isLiked: true
    },
    {
      id: "3",
      title: "Cola",
      artist: "Arlo Parks",
      album: "Super Sad Generation",
      duration: 230,
      cover: "/avatars/nicola.jpg",
      isLiked: false
    },
    {
      id: "4",
      title: "Do the Astral Plane",
      artist: "Flying Lotus",
      album: "Cosmogramma",
      duration: 238,
      cover: "/avatars/axs.jpg",
      isLiked: true
    }
  ]

  const handleSelectArtist = (artistId: string) => {
    console.log("Home view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  const handleLike = (postId: string) => {
    if (!user) return
    
    const success = userDataService.likePost(user, postId)
    if (success) {
      // Refresh feed
      const feed = userDataService.getFeedForUser(user)
      setFeedItems(feed)
    }
  }

  const handleOpenComments = (postId: string) => {
    setCurrentPostId(postId)
    setShowCommentDialog(true)
  }

  const handleSendComment = () => {
    if (!commentText.trim() || !currentPostId || !user) return

    const comment = userDataService.addComment(user, currentPostId, commentText)
    if (comment) {
      // Refresh feed
      const feed = userDataService.getFeedForUser(user)
      setFeedItems(feed)
      setCommentText("")
    }
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !user || !userData) return

    let content = newPostContent
    
    // Add location if selected
    if (selectedLocation) {
      content += ` 📍 ${selectedLocation}`
    }
    
    // Add poll if created
    if (pollOptions.some(option => option.trim())) {
      content += `\n\n📊 Poll:\n${pollOptions.filter(option => option.trim()).map((option, index) => `${index + 1}. ${option}`).join('\n')}`
    }

    const postData = {
      authorId: user,
      authorName: userData.username,
      authorAvatar: userData.profilePhoto || '/avatars/user.jpg',
      content: content,
      image: previewUrl || undefined,
      type: 'post' as const,
      tags: extractTags(newPostContent)
    }

    const newPost = userDataService.createPost(postData)
    if (newPost) {
      // Refresh feed
      const feed = userDataService.getFeedForUser(user)
      setFeedItems(feed)
      setNewPostContent("")
      setNewPostImage(null)
      setPreviewUrl(null)
      setSelectedLocation("")
      setPollOptions(["", ""])
      setSelectedFile(null)
      setShowCreatePost(false)
    }
  }

  const extractTags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g
    const matches = content.match(hashtagRegex)
    return matches ? matches.map(tag => tag.slice(1)) : []
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB')
        return
      }

      setNewPostImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleImageClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handleImageUpload(e as any)
    input.click()
  }

  const handleLocationClick = () => {
    setShowLocationPicker(true)
  }

  const handleHashtagClick = () => {
    setNewPostContent(prev => prev + ' #')
  }

  const handlePollClick = () => {
    setShowPollCreator(true)
  }

  const handleFileClick = () => {
    setShowFileUpload(true)
  }

  const handleAddPollOption = () => {
    setPollOptions(prev => [...prev, ""])
  }

  const handlePollOptionChange = (index: number, value: string) => {
    setPollOptions(prev => prev.map((option, i) => i === index ? value : option))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Please select a file smaller than 10MB')
        return
      }
      setSelectedFile(file)
      setNewPostContent(prev => prev + ` 📎 ${file.name}`)
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const handleTrackChange = (track: any) => {
    console.log("Now playing:", track.title, "by", track.artist)
  }

  const handleTrackLike = (trackId: string) => {
    const newLikedTracks = new Set(likedTracks)
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId)
    } else {
      newLikedTracks.add(trackId)
    }
    setLikedTracks(newLikedTracks)
  }

  const renderFeedItem = (item: FeedItem) => {
    if (item.type === 'post') {
      const post = item.data as Post
      const isLiked = user ? post.likes.includes(user) : false
      
      return (
        <Card key={item.id} className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-8 w-8 mr-2 cursor-pointer" onClick={() => handleSelectArtist(post.authorId)}>
                <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                <AvatarFallback>{post.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white cursor-pointer" onClick={() => handleSelectArtist(post.authorId)}>
                  {post.authorName}
                </p>
                <p className="text-gray-400 text-xs">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">{post.content}</p>
            {post.image && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img src={post.image} alt="Post image" className="w-full h-auto" />
              </div>
            )}
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <button 
                className="flex items-center" 
                onClick={() => handleLike(post.id)}
                disabled={!user}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
                {post.likes.length}
              </button>
              <button 
                className="flex items-center" 
                onClick={() => handleOpenComments(post.id)}
                disabled={!user}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments.length}
              </button>
              <button className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </CardContent>
        </Card>
      )
    } else if (item.type === 'activity') {
      const activity = item.data as Activity
      
      return (
        <Card key={item.id} className="bg-gray-800 border-gray-700">
          <CardContent className="p-3">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleSelectArtist(activity.userId)}>
                <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                <AvatarFallback>{activity.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-medium cursor-pointer" onClick={() => handleSelectArtist(activity.userId)}>
                    {activity.userName}
                  </span> {activity.action}
                </p>
                {activity.message && (
                  <p className="text-sm mt-1 bg-gray-700 p-2 rounded-lg text-gray-300">{activity.message}</p>
                )}
                <div className="flex items-center mt-1">
                  <p className="text-xs text-gray-400">{formatTimeAgo(activity.createdAt)}</p>
                  {activity.amount && activity.tokenName && (
                    <div className="flex items-center text-bright-yellow text-xs font-medium ml-2">
                      <BanknoteIcon className="h-4 w-4 mr-1" />
                      <span>
                        {activity.amount} ${activity.tokenName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    return null
  }

  return (
    <div className="pb-6 overflow-auto bg-gray-50 dark:bg-gray-950">
      {/* Featured Artists */}
      <div className="px-4 pt-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Featured Artists</h2>
        <div className="flex overflow-x-auto gap-1 pb-2 -mx-4 px-4">
          {featuredArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex-shrink-0 w-28"
              onClick={() => handleSelectArtist(artist.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm mt-2 text-center text-white">{artist.name}</p>
                <p className="text-xs text-gray-400">{artist.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message for fans */}
      {!isArtist() && showWelcomeBanner && (
        <div className="px-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">Welcome to DROPSLAND</h3>
                  <p className="text-sm text-gray-300">
                    Here you can discover artists, buy their tokens and receive exclusive rewards.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                      <BanknoteIcon className="h-5 w-5 mr-1" />
                      Buy Tokens
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-gray-700 text-white border-gray-600"
                      onClick={onNavigateToExplore}
                    >
                      Explore Artists
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWelcomeBanner(false)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 mt-6">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="feed" className="data-[state=active]:bg-teal-600">Feed</TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:bg-teal-600">Player</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            {/* What's on your USB */}
            {user && (
              <div className="mb-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={userData?.profilePhoto && userData.profilePhoto.trim() !== '' ? userData.profilePhoto : '/avatars/user.jpg'} 
                          alt="Your profile" 
                          onError={(e) => {
                            e.currentTarget.src = '/avatars/user.jpg'
                          }}
                        />
                        <AvatarFallback>{userData?.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's on your USB?"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white resize-none mb-3"
                          rows={3}
                        />
                        <div className="flex flex-wrap gap-4 mb-3 justify-start">
                          <ImageIcon className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" onClick={handleImageClick} />
                          <MapPin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" onClick={handleLocationClick} />
                          <Hash className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" onClick={handleHashtagClick} />
                          <BarChart2 className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" onClick={handlePollClick} />
                          <Paperclip className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" onClick={handleFileClick} />
                        </div>
                        <div className="flex justify-end">
                          <Button size="sm" onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                            <Send className="h-4 w-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="space-y-3">
              {feedItems.length > 0 ? (
                feedItems.map(renderFeedItem)
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-300">No posts yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Follow some artists to see their posts here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-4">
            <MusicPlayer onTrackChange={handleTrackChange} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-3">
              {currentPostId && (() => {
                const allPosts = userDataService.getAllPosts()
                const post = allPosts.find((p: any) => p.id === currentPostId)
                return post?.comments.map((comment: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                      <AvatarFallback>{comment.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-700 p-2 rounded-lg">
                      <p className="text-sm font-medium text-white">{comment.authorName}</p>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))
              })()}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Button onClick={handleSendComment} disabled={!commentText.trim()} className="bg-teal-600 hover:bg-teal-700">
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Picker Dialog */}
      <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter location..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowLocationPicker(false)} 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setShowLocationPicker(false)} 
                className="bg-teal-600 hover:bg-teal-700"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Poll Creator Dialog */}
      <Dialog open={showPollCreator} onOpenChange={setShowPollCreator}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Poll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">Add poll options:</p>
            {pollOptions.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            ))}
            <Button 
              onClick={handleAddPollOption} 
              variant="outline" 
              className="bg-gray-700 border-gray-600 text-white"
            >
              Add Option
            </Button>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowPollCreator(false)} 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setShowPollCreator(false)} 
                className="bg-teal-600 hover:bg-teal-700"
              >
                Create Poll
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Attach File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              onChange={handleFileUpload}
              className="bg-gray-700 border-gray-600 text-white p-2 rounded"
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowFileUpload(false)} 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setShowFileUpload(false)} 
                className="bg-teal-600 hover:bg-teal-700"
              >
                Attach
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Featured artists data
const featuredArtists = [
  {
    id: "iamjuampi",
    name: "iamjuampi",
    genre: "Techno / House",
    avatar: "/avatars/juampi.jpg",
  },
  {
    id: "banger",
    name: "banger",
    genre: "Techno",
    avatar: "/avatars/banger.jpg",
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    genre: "House",
    avatar: "/avatars/nicola.jpg",
  },
  {
    id: "axs",
    name: "AXS",
    genre: "Techno",
    avatar: "/avatars/axs.jpg",
  },
]

