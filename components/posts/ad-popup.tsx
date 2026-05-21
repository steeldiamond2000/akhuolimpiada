"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, ChevronRight } from "lucide-react"
import type { PostWithMedia } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AdPopupProps {
  ads: PostWithMedia[]
}

export function AdPopup({ ads }: AdPopupProps) {
  const [closedAds, setClosedAds] = useState<Set<number>>(new Set())
  const [expandedAdId, setExpandedAdId] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const visibleAds = ads.filter(ad => !closedAds.has(ad.id))
  const currentAd = visibleAds[0]

  useEffect(() => {
    if (currentAd) {
      // Slide in animation delay
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [currentAd?.id])

  if (!currentAd) return null

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(false)
    setTimeout(() => {
      setClosedAds(prev => new Set([...prev, currentAd.id]))
      setExpandedAdId(null)
    }, 300)
  }

  const handleExpand = () => {
    setExpandedAdId(expandedAdId === currentAd.id ? null : currentAd.id)
  }

  const firstImage = currentAd.media?.find(m => m.media_type === "image")
  const firstLink = currentAd.links?.[0]
  const isExpanded = expandedAdId === currentAd.id

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={handleClose}
        />
      )}

      {/* Ad Popup */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-500 ease-out",
          isExpanded 
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg"
            : "left-4 bottom-32 w-56",
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}
      >
        {/* Small collapsed version */}
        {!isExpanded && (
          <div
            onClick={handleExpand}
            className={cn(
              "relative bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-xl shadow-2xl overflow-hidden cursor-pointer",
              "animate-pulse-border hover:scale-105 transition-transform"
            )}
          >
            {/* Blinking border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-blink opacity-75" />
            
            <div className="relative bg-white m-0.5 rounded-xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-1 right-1 z-10 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              {/* Mini image */}
              {firstImage && (
                <div className="h-24 overflow-hidden">
                  <img
                    src={firstImage.url}
                    alt={currentAd.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <div className="p-2">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded animate-pulse">
                    REKLAMA
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-800 line-clamp-2">
                  {currentAd.title}
                </p>
                <div className="flex items-center justify-end mt-1 text-[10px] text-primary font-medium">
                  <span>Batafsil</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded version */}
        {isExpanded && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 p-3 flex items-center justify-between">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                <span className="animate-pulse">REKLAMA</span>
              </span>
              <button
                onClick={handleClose}
                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {currentAd.title}
              </h3>

              {firstImage && (
                <div className="rounded-lg overflow-hidden mb-3">
                  <img
                    src={firstImage.url}
                    alt={currentAd.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {currentAd.content && (
                <div
                  className="text-sm text-gray-600 mb-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentAd.content }}
                />
              )}

              {/* Action button */}
              {firstLink && (
                <a
                  href={firstLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  {firstLink.title || "Batafsil ko'rish"}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
