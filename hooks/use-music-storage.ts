"use client"

import { useState, useEffect, useCallback } from "react"
import { musicService, MusicMetadata, MusicFile } from "@/lib/music-service"
import { useToast } from "@/hooks/use-toast"

export interface UseMusicStorageReturn {
  // State
  musicFiles: MusicMetadata[]
  loading: boolean
  uploading: boolean
  
  // Actions
  uploadMusic: (file: File, name: string, artist: string) => Promise<string | null>
  getMusicData: (id: string) => Promise<Uint8Array | null>
  createMusicBlobUrl: (id: string) => Promise<string | null>
  deleteMusic: (id: string) => Promise<boolean>
  refreshMusic: () => Promise<void>
  
  // Stats
  stats: {
    totalFiles: number
    totalSize: number
  }
}

export function useMusicStorage(): UseMusicStorageReturn {
  const [musicFiles, setMusicFiles] = useState<MusicMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 })
  
  const { toast } = useToast()

  // Load all music metadata
  const loadMusicMetadata = useCallback(async () => {
    try {
      setLoading(true)
      const metadata = await musicService.getAllMusicMetadata()
      setMusicFiles(metadata)
      
      // Load stats
      const musicStats = await musicService.getMusicStats()
      setStats(musicStats)
    } catch (error) {
      console.error("Error loading music metadata:", error)
      toast({
        title: "Error",
        description: "Failed to load music files",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Upload music file
  const uploadMusic = useCallback(async (
    file: File, 
    name: string, 
    artist: string
  ): Promise<string | null> => {
    try {
      setUploading(true)
      
      // Convert file to Uint8Array
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Upload to canister
      const musicId = await musicService.uploadMusic(
        name,
        artist,
        uint8Array,
        file.type || 'audio/mpeg'
      )
      
      toast({
        title: "Success",
        description: `Music "${name}" uploaded successfully`,
      })
      
      // Refresh the list
      await loadMusicMetadata()
      
      return musicId
    } catch (error) {
      console.error("Error uploading music:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload music",
        variant: "destructive",
      })
      return null
    } finally {
      setUploading(false)
    }
  }, [loadMusicMetadata, toast])

  // Get music data
  const getMusicData = useCallback(async (id: string): Promise<Uint8Array | null> => {
    try {
      return await musicService.getMusicData(id)
    } catch (error) {
      console.error("Error getting music data:", error)
      toast({
        title: "Error",
        description: "Failed to get music data",
        variant: "destructive",
      })
      return null
    }
  }, [toast])

  // Create blob URL for streaming
  const createMusicBlobUrl = useCallback(async (id: string): Promise<string | null> => {
    try {
      return await musicService.createMusicBlobUrl(id)
    } catch (error) {
      console.error("Error creating blob URL:", error)
      toast({
        title: "Error",
        description: "Failed to create streaming URL",
        variant: "destructive",
      })
      return null
    }
  }, [toast])

  // Delete music file
  const deleteMusic = useCallback(async (id: string): Promise<boolean> => {
    try {
      await musicService.deleteMusic(id)
      
      toast({
        title: "Success",
        description: "Music file deleted successfully",
      })
      
      // Refresh the list
      await loadMusicMetadata()
      
      return true
    } catch (error) {
      console.error("Error deleting music:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete music",
        variant: "destructive",
      })
      return false
    }
  }, [loadMusicMetadata, toast])

  // Refresh music list
  const refreshMusic = useCallback(async () => {
    await loadMusicMetadata()
  }, [loadMusicMetadata])

  // Load music on mount
  useEffect(() => {
    loadMusicMetadata()
  }, [loadMusicMetadata])

  return {
    musicFiles,
    loading,
    uploading,
    uploadMusic,
    getMusicData,
    createMusicBlobUrl,
    deleteMusic,
    refreshMusic,
    stats,
  }
} 