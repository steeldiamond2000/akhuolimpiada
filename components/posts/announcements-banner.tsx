"use client"

import { useState } from "react"
import type { PostWithMedia } from "@/lib/types"
import { Bell, ChevronRight, X } from "lucide-react"

interface AnnouncementsBannerProps {
  announcements: PostWithMedia[]
}

export function AnnouncementsBanner({ announcements }: AnnouncementsBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || announcements.length === 0) return null

  const current = announcements[currentIndex]

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full mr-2">
                E&apos;lon
              </span>
              <span className="font-medium truncate">{current.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {announcements.length > 1 && (
              <button
                onClick={nextAnnouncement}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                title="Keyingi e'lon"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs opacity-75">
              {currentIndex + 1}/{announcements.length}
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors ml-2"
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
