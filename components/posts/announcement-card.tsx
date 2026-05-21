"use client"

import { useState } from "react"
import { MediaCarousel } from "./media-carousel"
import { ImageLightbox } from "./image-lightbox"
import { PostDetailModal } from "./post-detail-modal"
import type { PostWithMedia } from "@/lib/types"
import { ExternalLink, Pin, Bell, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"

interface AnnouncementCardProps {
  post: PostWithMedia
}

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [detailOpen, setDetailOpen] = useState(false)

  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: enUS,
  })

  const imageMedia = post.media?.filter(m => m.media_type === "image") || []

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Strip HTML tags for preview text (SSR-safe using regex)
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim()
  }

  const previewText = post.content ? stripHtml(post.content) : ""

  return (
    <>
      <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-400/50 overflow-hidden backdrop-blur-sm flex flex-col h-auto min-h-[450px]">
        {/* Header with announcement badge */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white animate-bounce" />
            <span className="text-white font-bold text-sm">ANNOUNCEMENT</span>
            {post.pinned && (
              <span className="flex items-center gap-1 text-xs text-white bg-white/20 px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" />
                Important
              </span>
            )}
          </div>
          <time className="text-xs text-white/80">
            {formattedDate}
          </time>
        </div>

        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          {/* Title */}
          <h2 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 flex-shrink-0">
            {post.title}
          </h2>

          {/* Media with click handler */}
          {post.media && post.media.length > 0 && (
            <div className="flex-shrink-0 mb-3">
              <MediaCarousel 
                media={post.media} 
                onImageClick={handleImageClick}
                compact
              />
            </div>
          )}

          {/* Content preview - show up to 8 lines */}
          {previewText && (
            <p className="text-sm text-gray-700 leading-relaxed" style={{ 
              display: "-webkit-box",
              WebkitLineClamp: 8,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>
              {previewText}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-green-200 flex-shrink-0">
            {/* Links preview */}
            <div className="flex items-center gap-1 flex-wrap overflow-hidden">
              {post.links && post.links.length > 0 && (
                <a
                  href={post.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  {post.links[0].title}
                </a>
              )}
            </div>
            
            {/* Read more button */}
            <button
              onClick={() => setDetailOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex-shrink-0"
            >
              Read More
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>

      {/* Detail Modal */}
      <PostDetailModal
        post={post}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

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
