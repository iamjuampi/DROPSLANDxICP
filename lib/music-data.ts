export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl: string
  isLiked?: boolean
}

// URLs de streaming para los archivos de música
// Usando los archivos de la carpeta public/music
export const musicTracks: Track[] = [
  {
    id: "1",
    title: "Bandolero (feat. Ace)",
    artist: "Banger",
    album: "Dropsland Collection",
    duration: 285, // 4:45 in seconds
    cover: "/avatars/banger.jpg",
    audioUrl: "/music/Banger - Bandolero (feat. Ace).mp3",
    isLiked: false
  },
  {
    id: "2",
    title: "Fuck That",
    artist: "Flush",
    album: "Dropsland Collection",
    duration: 372, // 6:12 in seconds
    cover: "/avatars/juampi.jpg",
    audioUrl: "/music/Flush - Fuck That.mp3",
    isLiked: true
  },
  {
    id: "3",
    title: "Sadtisfied",
    artist: "Flush",
    album: "Dropsland Collection",
    duration: 426, // 7:06 in seconds
    cover: "/avatars/juampi.jpg",
    audioUrl: "/music/Flush - Sadtisfied.mp3",
    isLiked: false
  },
  {
    id: "4",
    title: "Touch It",
    artist: "Flush",
    album: "Dropsland Collection",
    duration: 522, // 8:42 in seconds
    cover: "/avatars/juampi.jpg",
    audioUrl: "/music/Flush - Touch It.mp3",
    isLiked: true
  },
  {
    id: "5",
    title: "Better Than Sex",
    artist: "Nicola Marti",
    album: "Dropsland Collection",
    duration: 486, // 8:06 in seconds
    cover: "/avatars/nicola.jpg",
    audioUrl: "/music/Nicola Marti - Better Than Sex-4.mp3",
    isLiked: false
  },
  {
    id: "6",
    title: "SHADOWS",
    artist: "iamjuampi",
    album: "Dropsland Collection",
    duration: 378, // 6:18 in seconds
    cover: "/avatars/juampi.jpg",
    audioUrl: "/music/iamjuampi - SHADOWS.mp3",
    isLiked: true
  },
  {
    id: "7",
    title: "TOXIC",
    artist: "iamjuampi",
    album: "Dropsland Collection",
    duration: 342, // 5:42 in seconds
    cover: "/avatars/juampi.jpg",
    audioUrl: "/music/iamjuampi - TOXIC.mp3",
    isLiked: false
  }
]

// Función para obtener una pista por ID
export function getTrackById(id: string): Track | undefined {
  return musicTracks.find(track => track.id === id)
}

// Función para obtener todas las pistas
export function getAllTracks(): Track[] {
  return musicTracks
}

// Función para obtener pistas por artista
export function getTracksByArtist(artist: string): Track[] {
  return musicTracks.filter(track => 
    track.artist.toLowerCase().includes(artist.toLowerCase())
  )
}

// Función para buscar pistas
export function searchTracks(query: string): Track[] {
  const lowerQuery = query.toLowerCase()
  return musicTracks.filter(track => 
    track.title.toLowerCase().includes(lowerQuery) ||
    track.artist.toLowerCase().includes(lowerQuery) ||
    track.album.toLowerCase().includes(lowerQuery)
  )
} 