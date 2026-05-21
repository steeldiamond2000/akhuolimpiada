"use client"

import { useState, useCallback, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { PostMedia } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ImageLightboxProps {
  images: PostMedia[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "ArrowRight") goToNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]
  const isYouTube = currentImage.media_type === "youtube"

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match?.[1] || ""
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        aria-label="Yopish"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Oldingi"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image/Video container */}
      <div 
        className="w-full h-full flex items-center justify-center p-16"
        onClick={onClose}
      >
        <div 
          className="relative max-w-full max-h-full"
          onClick={e => e.stopPropagation()}
        >
          {isYouTube ? (
            <div className="w-[80vw] max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(currentImage.url)}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.caption || ""}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            />
          )}
          
          {/* Caption */}
          {currentImage.caption && (
            <p className="absolute -bottom-10 left-0 right-0 text-center text-white/80 text-sm">
              {currentImage.caption}
            </p>
          )}
        </div>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Keyingi"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Dots indicator */}
      {images.length > 1 && images.length <= 10 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Rasm ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
