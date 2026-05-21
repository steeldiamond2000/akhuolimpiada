"use client"

import { useState, useEffect } from "react"
import { MediaCarousel } from "./media-carousel"
import { ImageLightbox } from "./image-lightbox"
import type { PostWithMedia } from "@/lib/types"
import { X, ExternalLink, Pin, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"

interface PostDetailModalProps {
  post: PostWithMedia
  isOpen: boolean
  onClose: () => void
}

export function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !lightboxOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose, lightboxOpen])

  if (!isOpen) return null

  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: uz,
  })

  const imageMedia = post.media?.filter(m => m.media_type === "image" || m.media_type === "panorama") || []

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <div 
          className="relative bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Orqaga</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {/* Title and meta */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {post.pinned && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3" />
                    Muhim
                  </span>
                )}
                <time className="text-sm text-muted-foreground">
                  {formattedDate}
                </time>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
            </div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mb-6">
                <MediaCarousel 
                  media={post.media} 
                  onImageClick={handleImageClick}
                  className="rounded-xl overflow-hidden"
                />
              </div>
            )}

            {/* Full content */}
            {post.content && (
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground mb-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Links */}
            {post.links && post.links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {post.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
