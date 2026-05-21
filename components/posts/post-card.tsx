"use client"

import { useState } from "react"
import { MediaCarousel } from "./media-carousel"
import { ImageLightbox } from "./image-lightbox"
import { PostDetailModal } from "./post-detail-modal"
import type { PostWithMedia } from "@/lib/types"
import { ExternalLink, Pin, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"

interface PostCardProps {
  post: PostWithMedia
}

export function PostCard({ post }: PostCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [detailOpen, setDetailOpen] = useState(false)

  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: uz,
  })

  const imageMedia = post.media?.filter(m => m.media_type === "image" || m.media_type === "panorama") || []

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Strip HTML tags for preview text
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const previewText = post.content ? stripHtml(post.content) : ""
  const hasLongContent = previewText.length > 120

  return (
    <>
      <article className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-[420px]">
        {/* Header */}
        <div className="p-4 pb-2 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {post.pinned && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Pin className="w-3 h-3" />
                  Muhim
                </span>
              )}
            </div>
            <time className="text-xs text-muted-foreground whitespace-nowrap">
              {formattedDate}
            </time>
          </div>
          <h2 className="text-base font-bold text-foreground leading-tight line-clamp-2">
            {post.title}
          </h2>
        </div>

        {/* Media carousel */}
        {post.media && post.media.length > 0 && (
          <div className="px-4 flex-shrink-0">
            <MediaCarousel 
              media={post.media} 
              onImageClick={handleImageClick}
              compact
            />
          </div>
        )}

        {/* Content preview */}
        <div className="p-4 pt-3 flex-1 overflow-hidden flex flex-col">
          {previewText && (
            <p className="text-sm text-muted-foreground line-clamp-3 flex-shrink-0">
              {previewText}
            </p>
          )}
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Footer with links and button */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
            {/* Links preview */}
            <div className="flex items-center gap-1 flex-wrap overflow-hidden">
              {post.links && post.links.length > 0 && (
                <a
                  href={post.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  {post.links[0].title}
                </a>
              )}
              {post.links && post.links.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  +{post.links.length - 1}
                </span>
              )}
            </div>
            
            {/* Batafsil button */}
            <button
              onClick={() => setDetailOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              Batafsil
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
