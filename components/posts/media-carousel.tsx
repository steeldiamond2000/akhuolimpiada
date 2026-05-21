"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import type { PostMedia } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MediaCarouselProps {
  media: PostMedia[]
  className?: string
}

export function MediaCarousel({ media, className }: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  if (!media || media.length === 0) return null

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match?.[1] || ""
  }

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {media.map((item, index) => (
            <div key={item.id} className="flex-[0_0_100%] min-w-0">
              {item.media_type === "youtube" ? (
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : item.media_type === "panorama" ? (
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.caption || `Media ${index + 1}`}
                    className="w-full h-full object-cover cursor-move"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="relative aspect-[16/10]">
                  <img
                    src={item.url}
                    alt={item.caption || `Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {item.caption && (
                <p className="text-sm text-muted-foreground mt-2 text-center px-4">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-opacity",
              "hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary",
              "opacity-0 group-hover:opacity-100",
              !canScrollPrev && "hidden"
            )}
            aria-label="Oldingi"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-opacity",
              "hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary",
              "opacity-0 group-hover:opacity-100",
              !canScrollNext && "hidden"
            )}
            aria-label="Keyingi"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index === selectedIndex
                  ? "bg-white shadow-md scale-110"
                  : "bg-white/60 hover:bg-white/80"
              )}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
