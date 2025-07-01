import { useState, useEffect } from "react"
import { Search, Filter, TrendingUp, Music, Headphones, Guitar, Drum, Mic } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MusicCard from "@/components/music-card"
import { useMusicPlayer } from "@/hooks/use-music-player"

interface Artist {
  id: string
  name: string
  avatar: string
  genre: string
  followers: number
}

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl: string
}

interface Genre {
  id: string
  name: string
  icon: string
  artists: number
}

export function ExploreView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const { playTrack } = useMusicPlayer()

  // Sample data
  const trendingArtists: Artist[] = [
    {
      id: "1",
      name: "Flush",
      avatar: "/avatars/flush.jpg",
      genre: "Electronic",
      followers: 15420
    },
    {
      id: "2", 
      name: "Danilødr",
      avatar: "/avatars/danilodr.jpg",
      genre: "Dubstep",
      followers: 12890
    },
    {
      id: "3",
      name: "Kr4D",
      avatar: "/avatars/kr4d.jpg", 
      genre: "Bass",
      followers: 9870
    },
    {
      id: "4",
      name: "AXS",
      avatar: "/avatars/axs.jpg",
      genre: "Trap",
      followers: 11230
    }
  ]

  const popularTracks: Track[] = [
    {
      id: "1",
      title: "Best Drops Ever",
      artist: "Flush",
      album: "Dropsland Collection",
      duration: 225,
      cover: "/covers/best-drops-ever.jpg",
      audioUrl: "/audio/best-drops-ever.mp3"
    },
    {
      id: "2",
      title: "Broken",
      artist: "Danilødr",
      album: "Dropsland Collection", 
      duration: 252,
      cover: "/covers/broken.jpg",
      audioUrl: "/audio/broken.mp3"
    },
    {
      id: "3",
      title: "Sadtisfied",
      artist: "Flush",
      album: "Dropsland Collection",
      duration: 208,
      cover: "/covers/sadtisfied.jpg", 
      audioUrl: "/audio/sadtisfied.mp3"
    },
    {
      id: "4",
      title: "Riddim Tutorial",
      artist: "AXS",
      album: "Dropsland Collection",
      duration: 315,
      cover: "/covers/riddim-tutorial.jpg",
      audioUrl: "/audio/riddim-tutorial.mp3"
    },
    {
      id: "5",
      title: "Kingman",
      artist: "AXS, Brolow",
      album: "Dropsland Collection",
      duration: 273,
      cover: "/covers/kingman.jpg",
      audioUrl: "/audio/kingman.mp3"
    },
    {
      id: "6",
      title: "Body",
      artist: "Kr4D",
      album: "Dropsland Collection",
      duration: 232,
      cover: "/covers/body.jpg",
      audioUrl: "/audio/body.mp3"
    },
    {
      id: "7",
      title: "Travel",
      artist: "Flush",
      album: "Dropsland Collection",
      duration: 248,
      cover: "/covers/travel.jpg",
      audioUrl: "/audio/travel.mp3"
    },
    {
      id: "8",
      title: "Arriving",
      artist: "Flush",
      album: "Dropsland Collection",
      duration: 235,
      cover: "/covers/arriving.jpg",
      audioUrl: "/audio/arriving.mp3"
    }
  ]

  const genres: Genre[] = [
    { id: "1", name: "Dubstep", icon: "🎵", artists: 45 },
    { id: "2", name: "Trap", icon: "🎧", artists: 32 },
    { id: "3", name: "Bass", icon: "🥁", artists: 28 },
    { id: "4", name: "Electronic", icon: "🎤", artists: 56 }
  ]

  const handleTrackLike = (trackId: string) => {
    const newLikedTracks = new Set(likedTracks)
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId)
    } else {
      newLikedTracks.add(trackId)
    }
    setLikedTracks(newLikedTracks)
  }

  const handleTrackPlay = (track: Track) => {
    playTrack(track)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search artists, tracks, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-1" />
            All
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
            <TrendingUp className="h-4 w-4 mr-1" />
            Trending
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
            <Music className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Trending Artists */}
      <div className="px-4 pt-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Trending Artists</h2>
        <div className="grid grid-cols-2 gap-3">
          {trendingArtists.map((artist) => (
            <Card key={artist.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{artist.name}</h3>
                    <p className="text-sm text-gray-400">{artist.genre}</p>
                    <p className="text-xs text-gray-500">{artist.followers} followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Popular Tracks</h2>
        <div className="space-y-2">
          {popularTracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onLike={handleTrackLike}
              isLiked={likedTracks.has(track.id)}
            />
          ))}
        </div>
      </div>

      {/* Discover Genres */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Discover Genres</h2>
        <div className="grid grid-cols-2 gap-3">
          {genres.map((genre) => (
            <Card key={genre.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{genre.icon}</span>
                  </div>
                  <h3 className="font-medium text-white">{genre.name}</h3>
                  <p className="text-sm text-gray-400">{genre.artists} artists</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 