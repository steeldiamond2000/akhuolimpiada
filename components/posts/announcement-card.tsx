"use client"

import { useState } from "react"
import { MediaCarousel } from "./media-carousel"
import { ImageLightbox } from "./image-lightbox"
import type { PostWithMedia } from "@/lib/types"
import { ExternalLink, Pin, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"

interface AnnouncementCardProps {
  post: PostWithMedia
}

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: uz,
  })

  const imageMedia = post.media?.filter(m => m.media_type === "image") || []

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-400/50 overflow-hidden backdrop-blur-sm">
        {/* Header with announcement badge */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white animate-bounce" />
            <span className="text-white font-bold text-sm">E&apos;LON</span>
            {post.pinned && (
              <span className="flex items-center gap-1 text-xs text-white bg-white/20 px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" />
                Muhim
              </span>
            )}
          </div>
          <time className="text-xs text-white/80">
            {formattedDate}
          </time>
        </div>

        <div className="p-4 md:p-5">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3">
            {post.title}
          </h2>

          {/* Media with click handler */}
          {post.media && post.media.length > 0 && (
            <div 
              className="cursor-pointer"
              onClick={() => handleImageClick(0)}
            >
              <MediaCarousel 
                media={post.media} 
                onImageClick={handleImageClick}
              />
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div
              className="mt-4 prose prose-sm max-w-none prose-headings:font-bold prose-a:text-green-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Links */}
          {post.links && post.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Lightbox */}
      <ImageLightbox
        images={imageMedia}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
