"use client"

import { Play, Heart, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMusicPlayer } from "@/hooks/use-music-player"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl?: string
  isLiked?: boolean
}

interface MusicCardProps {
  track: Track
  onLike?: (trackId: string) => void
  isLiked?: boolean
}

export default function MusicCard({ track, onLike, isLiked = false }: MusicCardProps) {
  const musicPlayer = useMusicPlayer()
  
  const isCurrentTrackPlaying = musicPlayer.currentTrack?.id === track.id && musicPlayer.isPlaying

  const handlePlay = () => {
    musicPlayer.playTrack(track)
  }

  const handleLike = () => {
    if (onLike) {
      onLike(track.id)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Album Cover with Play Button */}
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={track.cover} alt={track.album} />
              <AvatarFallback className="bg-gray-700 text-white text-sm">
                {track.artist.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Play Button Overlay */}
            <Button
              onClick={handlePlay}
              className="absolute inset-0 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 p-0 opacity-0 hover:opacity-100 transition-opacity"
            >
              {isCurrentTrackPlaying ? (
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {track.title}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {track.artist} • {track.album}
            </p>
            <p className="text-gray-500 text-xs">
              {musicPlayer.formatTime(track.duration)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-gray-400 hover:text-white p-1 ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-1"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 