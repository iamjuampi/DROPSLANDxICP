import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { MusicPlayerProvider } from "@/contexts/music-player-context"
import MiniPlayerWrapper from "@/components/mini-player-wrapper"
import ExpandedPlayer from "@/components/expanded-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DROPSLAND",
  description: "Music platform on the Internet Computer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MusicPlayerProvider>
              {children}
              <MiniPlayerWrapper />
              <ExpandedPlayer />
            </MusicPlayerProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

