import { Actor, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { idlFactory } from "../src/declarations/dropsland_backend/dropsland_backend.did.js"

export interface MusicFile {
  id: string
  name: string
  artist: string
  data: Uint8Array
  contentType: string
  size: number
  uploadedAt: bigint
  uploadedBy: Principal
}

export interface MusicMetadata {
  id: string
  name: string
  artist: string
  size: number
  contentType: string
  uploadedAt: bigint
  uploadedBy: Principal
}

export interface MusicStats {
  totalFiles: number
  totalSize: number
}

class MusicService {
  private agent: HttpAgent
  private actor: any
  private canisterId: string

  constructor() {
    this.canisterId = "5c3ao-uyaaa-aaaae-qfcwq-cai" // dropsland_backend canister ID
    this.agent = new HttpAgent({
      host: "https://ic0.app"
    })
    
    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: this.canisterId
    })
  }

  // Upload music file
  async uploadMusic(
    name: string,
    artist: string,
    data: Uint8Array,
    contentType: string
  ): Promise<string> {
    try {
      const result = await this.actor.uploadMusic(name, artist, Array.from(data), contentType)
      
      if ('ok' in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error uploading music:", error)
      throw error
    }
  }

  // Get music metadata by ID
  async getMusicMetadata(id: string): Promise<MusicMetadata> {
    try {
      const result = await this.actor.getMusicMetadata(id)
      
      if ('ok' in result) {
        return {
          id: result.ok.id,
          name: result.ok.name,
          artist: result.ok.artist,
          size: Number(result.ok.size),
          contentType: result.ok.contentType,
          uploadedAt: result.ok.uploadedAt,
          uploadedBy: result.ok.uploadedBy
        }
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error getting music metadata:", error)
      throw error
    }
  }

  // Get all music metadata
  async getAllMusicMetadata(): Promise<MusicMetadata[]> {
    try {
      const result = await this.actor.getAllMusicMetadata()
      
      return result.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artist,
        size: Number(item.size),
        contentType: item.contentType,
        uploadedAt: item.uploadedAt,
        uploadedBy: item.uploadedBy
      }))
    } catch (error) {
      console.error("Error getting all music metadata:", error)
      throw error
    }
  }

  // Get music data by ID
  async getMusicData(id: string): Promise<Uint8Array> {
    try {
      const result = await this.actor.getMusicData(id)
      
      if ('ok' in result) {
        return new Uint8Array(result.ok)
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error getting music data:", error)
      throw error
    }
  }

  // Get music file (metadata + data)
  async getMusicFile(id: string): Promise<MusicFile> {
    try {
      const result = await this.actor.getMusicFile(id)
      
      if ('ok' in result) {
        return {
          id: result.ok.id,
          name: result.ok.name,
          artist: result.ok.artist,
          data: new Uint8Array(result.ok.data),
          contentType: result.ok.contentType,
          size: Number(result.ok.size),
          uploadedAt: result.ok.uploadedAt,
          uploadedBy: result.ok.uploadedBy
        }
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error getting music file:", error)
      throw error
    }
  }

  // Delete music file
  async deleteMusic(id: string): Promise<void> {
    try {
      const result = await this.actor.deleteMusic(id)
      
      if ('ok' in result) {
        return
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error deleting music:", error)
      throw error
    }
  }

  // Get music statistics
  async getMusicStats(): Promise<MusicStats> {
    try {
      const result = await this.actor.getMusicStats()
      
      return {
        totalFiles: Number(result.totalFiles),
        totalSize: Number(result.totalSize)
      }
    } catch (error) {
      console.error("Error getting music stats:", error)
      throw error
    }
  }

  // Create a blob URL for streaming
  async createMusicBlobUrl(id: string): Promise<string> {
    try {
      const musicData = await this.getMusicData(id)
      const blob = new Blob([musicData], { type: 'audio/mpeg' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error("Error creating blob URL:", error)
      throw error
    }
  }

  // Get streaming URL (for direct access)
  getStreamingUrl(id: string): string {
    // This would be used if we implement HTTP interface in the canister
    // For now, we'll use the blob URL approach
    return `https://${this.canisterId}.icp0.io/music/${id}`
  }
}

// Export singleton instance
export const musicService = new MusicService() 