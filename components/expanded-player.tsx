"use client"

import { useState } from "react"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  List,
  Minimize2,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMusicPlayer } from "@/hooks/use-music-player"
import { musicTracks } from "@/lib/music-data"

export default function ExpandedPlayer() {
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeated, setIsRepeated] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(true) // Show queue by default
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  const musicPlayer = useMusicPlayer()

  if (!musicPlayer.isExpanded || !musicPlayer.currentTrack) {
    return null
  }

  // Handle seek
  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    musicPlayer.seek(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    musicPlayer.setVolumeLevel(newVolume)
  }

  // Handle like toggle
  const toggleLike = () => {
    const newLikedTracks = new Set(likedTracks)
    if (newLikedTracks.has(musicPlayer.currentTrack!.id)) {
      newLikedTracks.delete(musicPlayer.currentTrack!.id)
    } else {
      newLikedTracks.add(musicPlayer.currentTrack!.id)
    }
    setLikedTracks(newLikedTracks)
  }

  // Handle playlist track selection
  const playTrackFromPlaylist = (track: any, index: number) => {
    musicPlayer.playTrack(track)
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">Now Playing</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-gray-400 hover:text-white"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={musicPlayer.collapsePlayer}
              className="text-gray-400 hover:text-white"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={musicPlayer.collapsePlayer}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Player */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            {/* Album Cover */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={musicPlayer.currentTrack.cover} 
                    alt={`${musicPlayer.currentTrack.album} cover`}
                  />
                  <AvatarFallback className="bg-gray-700 text-white text-lg">
                    {musicPlayer.currentTrack.artist.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {musicPlayer.isPlaying && (
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <h3 className="text-white font-semibold text-lg mb-1">
                {musicPlayer.currentTrack.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                {musicPlayer.currentTrack.artist} • {musicPlayer.currentTrack.album}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[musicPlayer.currentTime]}
                  max={musicPlayer.duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{musicPlayer.formatTime(musicPlayer.currentTime)}</span>
                  <span>{musicPlayer.formatTime(musicPlayer.duration)}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`text-gray-400 hover:text-white ${isShuffled ? 'text-teal-400' : ''}`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={musicPlayer.previousTrack}
                className="text-gray-400 hover:text-white"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={musicPlayer.togglePlay}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full h-12 w-12 p-0"
              >
                {musicPlayer.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={musicPlayer.nextTrack}
                className="text-gray-400 hover:text-white"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRepeated(!isRepeated)}
                className={`text-gray-400 hover:text-white ${isRepeated ? 'text-teal-400' : ''}`}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  className={`text-gray-400 hover:text-white ${likedTracks.has(musicPlayer.currentTrack.id) ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${likedTracks.has(musicPlayer.currentTrack.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={musicPlayer.toggleMute}
                  className="text-gray-400 hover:text-white"
                >
                  {musicPlayer.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[musicPlayer.isMuted ? 0 : musicPlayer.volume]}
                    max={100}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playlist - Always visible when expanded */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-3">Queue</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {musicTracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    index === musicPlayer.currentTrackIndex 
                      ? 'bg-teal-600/20 border border-teal-500/30' 
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => playTrackFromPlaylist(track, index)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={track.cover} alt={track.album} />
                    <AvatarFallback className="bg-gray-700 text-white text-xs">
                      {track.artist.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      index === musicPlayer.currentTrackIndex ? 'text-teal-400' : 'text-white'
                    }`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {track.artist} • {track.album}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {musicPlayer.formatTime(track.duration)}
                    </span>
                    {likedTracks.has(track.id) && (
                      <Heart className="h-3 w-3 text-red-500 fill-current" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        musicPlayer.playTrack(track)
                      }}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 