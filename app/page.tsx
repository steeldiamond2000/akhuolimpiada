import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { VideoSection } from "@/components/landing/video-section"
import { CountdownSection } from "@/components/landing/countdown-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CountdownSection />
        <VideoSection />
      </main>
      <Footer />
    </div>
  )
}
