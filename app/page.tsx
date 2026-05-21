import { Header } from "@/components/landing/header"
import { PostsSection } from "@/components/landing/posts-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <PostsSection />
      </main>
      <Footer />
    </div>
  )
}
