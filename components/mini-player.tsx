"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { useMusicPlayer } from "@/hooks/use-music-player"
import { musicTracks } from "@/lib/music-data"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl?: string
}

interface MiniPlayerProps {
  track?: Track
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onExpand?: () => void
  onStop?: () => void
}

export default function MiniPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onExpand,
  onStop
}: MiniPlayerProps) {
  if (!track) return null

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50">
      <div className="w-full max-w-md bg-gray-900 border-t border-gray-800 rounded-t-xl shadow-lg px-3 py-2 cursor-pointer" onClick={onExpand}>
        <div className="flex items-center gap-3">
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {track.title}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {track.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="text-gray-400 hover:text-white p-0 h-7 w-7"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onPlayPause}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-full h-7 w-7 p-0"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="text-gray-400 hover:text-white p-0 h-7 w-7"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onStop}
              className="text-gray-400 hover:text-red-500 p-0 h-7 w-7"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => onSeek(value[0])}
            className="w-full h-1"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 