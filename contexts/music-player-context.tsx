import React, { useState, useRef, useEffect, useCallback, useContext, createContext, ReactNode } from 'react'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl?: string
  isLiked?: boolean
}

interface MusicPlayerContextProps {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  showMiniPlayer: boolean
  playTrack: (track: Track) => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolumeLevel: (volume: number) => void
  toggleMute: () => void
  hideMiniPlayer: () => void
  formatTime: (time: number) => string
  audioRef: React.RefObject<HTMLAudioElement>
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Format time from seconds to MM:SS
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // Play a track
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setShowMiniPlayer(true)
    setCurrentTime(0)
    
    if (audioRef.current && track.audioUrl) {
      audioRef.current.src = track.audioUrl
      audioRef.current.play()
    }
  }, [])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!currentTrack) return
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [currentTrack, isPlaying])

  // Seek to specific time
  const seek = useCallback((time: number) => {
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  // Set volume
  const setVolumeLevel = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (audioRef.current) {
        audioRef.current.muted = !prev
      }
      return !prev
    })
  }, [])

  // Hide mini player
  const hideMiniPlayer = useCallback(() => {
    setShowMiniPlayer(false)
  }, [])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        showMiniPlayer,
        playTrack,
        togglePlay,
        seek,
        setVolumeLevel,
        toggleMute,
        hideMiniPlayer,
        formatTime,
        audioRef
      }}
    >
      {children}
      {/* Hidden Audio Element - Global */}
      <audio ref={audioRef} preload="metadata" />
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
} 