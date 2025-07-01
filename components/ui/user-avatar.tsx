import React from "react"
import { User } from "lucide-react"

interface UserAvatarProps {
  src?: string
  alt?: string
  username?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ src, alt, username, size = "md", className = "" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Profile"}
        className={`rounded-full object-cover border-2 border-teal-200 ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-teal-600 flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}
    >
      {username ? getInitials(username) : <User className="w-1/2 h-1/2" />}
    </div>
  )
} 