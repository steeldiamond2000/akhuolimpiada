import type { PostWithMedia } from "@/lib/types"
import { AnnouncementCard } from "./announcement-card"

interface HeroSectionProps {
  announcements: PostWithMedia[]
}

export function HeroSection({ announcements }: HeroSectionProps) {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/back.jpg')" }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Text */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-4">
            Ecological Events at Al-Khwarizmi University
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-3xl mx-auto">
            Latest news about EcoActive students&apos; activities and environmental events
          </p>
        </div>

        {/* Announcements Grid */}
        {announcements.length > 0 && (
          <div className="mt-8">
            <div className={`grid gap-4 md:gap-6 ${announcements.length === 1 ? 'max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} post={announcement} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
