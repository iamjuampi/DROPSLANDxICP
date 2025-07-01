"use client"

import { useState, useRef, useEffect } from "react"
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
  Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMusicPlayer } from "@/hooks/use-music-player"
import { Track, musicTracks } from "@/lib/music-data"

interface MusicPlayerProps {
  tracks?: Track[]
  onTrackChange?: (track: Track) => void
}

export default function MusicPlayer({ tracks = musicTracks, onTrackChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeated, setIsRepeated] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [isFullscreen, setIsFullscreen] = useState(false)

  const musicPlayer = useMusicPlayer()
  const currentTrack = tracks[currentTrackIndex]

  // Check if current track is playing
  const isCurrentTrackPlaying = musicPlayer.currentTrack?.id === currentTrack.id && musicPlayer.isPlaying

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle play/pause
  const togglePlay = () => {
    if (isCurrentTrackPlaying) {
      musicPlayer.togglePlay()
    } else {
      musicPlayer.playTrack(currentTrack)
    }
  }

  // Handle next track
  const nextTrack = () => {
    const nextIndex = isRepeated 
      ? currentTrackIndex 
      : (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
    if (onTrackChange) {
      onTrackChange(tracks[nextIndex])
    }
  }

  // Handle previous track
  const prevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    if (onTrackChange) {
      onTrackChange(tracks[prevIndex])
    }
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
    if (newLikedTracks.has(currentTrack.id)) {
      newLikedTracks.delete(currentTrack.id)
    } else {
      newLikedTracks.add(currentTrack.id)
    }
    setLikedTracks(newLikedTracks)
  }

  // Handle playlist track selection
  const playTrackFromPlaylist = (track: Track, index: number) => {
    setCurrentTrackIndex(index)
    musicPlayer.playTrack(track)
    if (onTrackChange) {
      onTrackChange(track)
    }
    setShowPlaylist(false)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Player */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          {/* Album Cover */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={currentTrack.cover} 
                  alt={`${currentTrack.album} cover`}
                />
                <AvatarFallback className="bg-gray-700 text-white text-lg">
                  {currentTrack.artist.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isCurrentTrackPlaying && (
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold text-lg mb-1">
              {currentTrack.title}
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              {currentTrack.artist} • {currentTrack.album}
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
              onClick={prevTrack}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={togglePlay}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-full h-12 w-12 p-0"
            >
              {isCurrentTrackPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
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
                className={`text-gray-400 hover:text-white ${likedTracks.has(currentTrack.id) ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${likedTracks.has(currentTrack.id) ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="text-gray-400 hover:text-white"
              >
                <List className="h-4 w-4" />
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
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-white"
              >
                <Maximize2 className={`h-4 w-4 ${isFullscreen ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      {showPlaylist && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-3">Queue</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    index === currentTrackIndex 
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
                      index === currentTrackIndex ? 'text-teal-400' : 'text-white'
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
      )}
    </div>
  )
} 