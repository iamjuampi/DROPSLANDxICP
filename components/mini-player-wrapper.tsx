"use client"

import { useMusicPlayer } from "@/hooks/use-music-player"
import MiniPlayer from "./mini-player"

export default function MiniPlayerWrapper() {
  const musicPlayer = useMusicPlayer()

  if (!musicPlayer.showMiniPlayer || !musicPlayer.currentTrack) {
    return null
  }

  return (
    <MiniPlayer
      track={musicPlayer.currentTrack}
      isPlaying={musicPlayer.isPlaying}
      currentTime={musicPlayer.currentTime}
      duration={musicPlayer.duration}
      onPlayPause={musicPlayer.togglePlay}
      onNext={musicPlayer.nextTrack}
      onPrevious={musicPlayer.previousTrack}
      onSeek={musicPlayer.seek}
      onExpand={musicPlayer.expandPlayer}
      onStop={() => {
        musicPlayer.hideMiniPlayer()
      }}
    />
  )
} 