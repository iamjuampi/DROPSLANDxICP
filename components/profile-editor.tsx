"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Camera, Upload, X, Edit } from "lucide-react"

interface ProfileEditorProps {
  user: {
    id: string
    username: string
    handle?: string
    profilePhoto?: string
    coverPhoto?: string
    genre?: string
    bio?: string
  }
  onSave: (updatedUser: any) => void
  onCancel: () => void
}

export default function ProfileEditor({ user, onSave, onCancel }: ProfileEditorProps) {
  const [username, setUsername] = useState(user.username)
  const [handle, setHandle] = useState(user.handle || "")
  const [profileImage, setProfileImage] = useState(user.profilePhoto || "")
  const [coverImage, setCoverImage] = useState(user.coverPhoto || "")
  const [genre, setGenre] = useState(user.genre || "")
  const [bio, setBio] = useState(user.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateBackendProfile } = useAuth()
  
  const profileImageRef = useRef<HTMLInputElement>(null)
  const coverImageRef = useRef<HTMLInputElement>(null)

  // Sample genres for fans
  const sampleGenres = [
    "Techno",
    "House", 
    "Tech-House",
    "Progressive House",
    "Deep House",
    "Minimal Techno",
    "Acid Techno",
    "Industrial Techno",
    "Melodic Techno",
    "Trance",
    "Progressive Trance",
    "Psytrance",
    "Drum & Bass",
    "Dubstep",
    "Ambient",
    "Downtempo"
  ]

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCoverImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    console.log("ProfileEditor: handleSave called", { username, handle, profileImage, coverImage, genre, bio })
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "El nombre de usuario es requerido",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("ProfileEditor: Calling updateBackendProfile")
      // Update backend
      const success = await updateBackendProfile(
        username.trim(),
        handle.trim() || undefined,
        profileImage || undefined,
        coverImage || undefined,
        genre.trim() || undefined,
        bio.trim() || undefined
      )
      
      console.log("ProfileEditor: updateBackendProfile result", success)
      
      if (success) {
        const updatedUser = {
          ...user,
          username: username.trim(),
          handle: handle.trim() || undefined,
          profilePhoto: profileImage || undefined,
          coverPhoto: coverImage || undefined,
          genre: genre.trim() || undefined,
          bio: bio.trim() || undefined,
        }
        
        console.log("ProfileEditor: Calling onSave with", updatedUser)
        onSave(updatedUser)
        
        toast({
          title: "Perfil actualizado",
          description: "Tu perfil se ha actualizado exitosamente",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("ProfileEditor: Error updating profile:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Cover Image */}
          <div>
            <Label className="text-gray-300 mb-2 block">Imagen de Portada</Label>
            <div 
              className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => coverImageRef.current?.click()}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Camera className="h-8 w-8" />
                </div>
              )}
              
              {/* Overlay with edit icon */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Edit className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <input
                ref={coverImageRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Haz clic en la imagen para cambiar la portada</p>
          </div>

          {/* Profile Image */}
          <div>
            <Label className="text-gray-300 mb-2 block">Foto de Perfil</Label>
            <div className="flex justify-center">
              <div 
                className="relative w-24 h-24 bg-gray-800 rounded-full overflow-hidden cursor-pointer group"
                onClick={() => profileImageRef.current?.click()}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
                
                {/* Overlay with edit icon */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-full">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Edit className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">Haz clic en la imagen para cambiar la foto de perfil</p>
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-gray-300">Nombre de Usuario *</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-bright-yellow"
              placeholder="Tu nombre de usuario"
              required
            />
          </div>

          {/* Handle */}
          <div>
            <Label htmlFor="handle" className="text-gray-300">@handle</Label>
            <Input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-bright-yellow"
              placeholder="@tu_handle"
            />
            <p className="text-xs text-gray-500 mt-1">Opcional - tu identificador único</p>
          </div>

          {/* Genre */}
          <div>
            <Label htmlFor="genre" className="text-gray-300">Género Musical</Label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:border-bright-yellow focus:outline-none"
            >
              <option value="">Selecciona tu género favorito</option>
              {sampleGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Opcional - tu género musical preferido</p>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-gray-300">Descripción</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:border-bright-yellow focus:outline-none"
              rows={4}
              placeholder="Escribe algo sobre ti..."
            />
            <p className="text-xs text-gray-500 mt-1">Opcional - una breve descripción de tu perfil</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading || !username.trim()}
              className="flex-1 bg-bright-yellow hover:bg-bright-yellow-700 text-black disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 