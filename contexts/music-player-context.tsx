"use client"

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
  isExpanded: boolean
  currentTrackIndex: number
  playTrack: (track: Track) => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolumeLevel: (volume: number) => void
  toggleMute: () => void
  hideMiniPlayer: () => void
  expandPlayer: () => void
  collapsePlayer: () => void
  nextTrack: () => void
  previousTrack: () => void
  formatTime: (time: number) => string
  audioRef: React.RefObject<HTMLAudioElement | null>
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
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlist, setPlaylist] = useState<Track[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)

  // Format time from seconds to MM:SS
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // Play a track
  const playTrack = useCallback((track: Track) => {
    try {
      const isNewTrack = currentTrack?.id !== track.id
      setCurrentTrack(track)
      setIsPlaying(true)
      setShowMiniPlayer(true)
      
      // Update playlist and track index
      if (isNewTrack) {
        // Import musicTracks dynamically to avoid circular dependency
        import('@/lib/music-data').then(({ musicTracks }) => {
          const trackIndex = musicTracks.findIndex(t => t.id === track.id)
          setPlaylist(musicTracks)
          setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0)
        })
        setCurrentTime(0)
      }
      
      if (audioRef.current && track.audioUrl) {
        // Only set src if it's a new track or if there's no src
        if (isNewTrack || !audioRef.current.src) {
          audioRef.current.src = track.audioUrl
        }
        audioRef.current.play().catch((error) => {
          console.error('Error playing track:', error)
          setIsPlaying(false)
          setShowMiniPlayer(false)
        })
      }
    } catch (error) {
      console.error('Error in playTrack:', error)
      setIsPlaying(false)
      setShowMiniPlayer(false)
    }
  }, [currentTrack?.id])

  // Next track
  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return
    
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    const nextTrack = playlist[nextIndex]
    if (nextTrack) {
      playTrack(nextTrack)
    }
  }, [playlist, currentTrackIndex, playTrack])

  // Previous track
  const previousTrack = useCallback(() => {
    if (playlist.length === 0) return
    
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
    const prevTrack = playlist[prevIndex]
    if (prevTrack) {
      playTrack(prevTrack)
    }
  }, [playlist, currentTrackIndex, playTrack])

  // Expand player
  const expandPlayer = useCallback(() => {
    setIsExpanded(true)
  }, [])

  // Collapse player
  const collapsePlayer = useCallback(() => {
    setIsExpanded(false)
  }, [])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!currentTrack) return
    
    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error)
            setIsPlaying(false)
          })
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.error('Error in togglePlay:', error)
      setIsPlaying(false)
    }
  }, [currentTrack, isPlaying])

  // Seek to specific time
  const seek = useCallback((time: number) => {
    try {
      setCurrentTime(time)
      if (audioRef.current) {
        audioRef.current.currentTime = time
      }
    } catch (error) {
      console.error('Error in seek:', error)
    }
  }, [])

  // Set volume
  const setVolumeLevel = useCallback((newVolume: number) => {
    try {
      setVolume(newVolume)
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100
      }
    } catch (error) {
      console.error('Error in setVolumeLevel:', error)
    }
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    try {
      setIsMuted((prev) => {
        if (audioRef.current) {
          audioRef.current.muted = !prev
        }
        return !prev
      })
    } catch (error) {
      console.error('Error in toggleMute:', error)
    }
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

    const handleError = (error: Event) => {
      console.error('Audio error:', error)
      setIsPlaying(false)
      setShowMiniPlayer(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
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
        isExpanded,
        currentTrackIndex,
        playTrack,
        togglePlay,
        seek,
        setVolumeLevel,
        toggleMute,
        hideMiniPlayer,
        expandPlayer,
        collapsePlayer,
        nextTrack,
        previousTrack,
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