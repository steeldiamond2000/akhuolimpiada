"use client"

import { useRef, useEffect, useState } from "react"
import { Volume2, VolumeX, Play } from "lucide-react"

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
            setIsPlaying(true)
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const handleVideoClick = () => {
    toggleMute()
  }

  return (
    <section ref={sectionRef} className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className="w-full aspect-video object-cover"
              poster="/university-campus-aerial.png"
            >
              <source src="/test.mp4" type="video/mp4" />
              Brauzeringiz video formatini qo'llab-quvvatlamaydi.
            </video>

            {/* Mute/Unmute indicator */}
            <div className="absolute bottom-4 right-4 p-2 rounded-full bg-background/20 backdrop-blur-sm text-background opacity-0 group-hover:opacity-100 transition-opacity">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </div>

            {/* Play indicator on hover */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                <Play className="h-16 w-16 text-background" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Al-Xorazmiy Olimpiadasi - Bilim va Iste'dod Bellashuvi
            </h2>

            <div className="space-y-4 text-background/80 leading-relaxed">
              <p>
                Al-Xorazmiy universiteti tomonidan tashkil etilgan ushbu olimpiada o'quvchilar
                uchun o'z bilim va ko'nikmalarini namoyish etish imkoniyatini beradi.
              </p>

              <p>
                Olimpiada 4 ta yo'nalishda o'tkaziladi: Dasturlash, Fizika, Suniy intellekt va Matematika. Har bir
                yo'nalish bo'yicha maxsus tayyorlangan savollar ishtirokchilarning chuqur bilimlarini sinash uchun
                mo'ljallangan.
              </p>

              <p>
                G'oliblar universitet imtiyozlari va maxsus sovg'alar bilan taqdirlanadi. Bu nafaqat bilim bellashuvi,
                balki kelajak mutaxassislarini aniqlash maydonidir.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-background/20" />
              <span className="text-sm text-background/60">Al-Xorazmiy 2026</span>
              <div className="h-px flex-1 bg-background/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
