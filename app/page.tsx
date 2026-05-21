import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/posts/hero-section"
import { PostsList } from "@/components/posts/posts-list"
import { AdPopupWrapper } from "@/components/posts/ad-popup-wrapper"
import { Footer } from "@/components/landing/footer"
import { query } from "@/lib/db"
import type { Post, PostMedia, PostLink, PostWithMedia } from "@/lib/types"

async function getPosts(): Promise<PostWithMedia[]> {
  try {
    const posts = await query<Post>(
      `SELECT * FROM posts WHERE published = true 
       ORDER BY pinned DESC, created_at DESC`
    )

    const postsWithMedia: PostWithMedia[] = await Promise.all(
      posts.map(async (post) => {
        const media = await query<PostMedia>(
          "SELECT * FROM post_media WHERE post_id = $1 ORDER BY sort_order",
          [post.id]
        )
        const links = await query<PostLink>(
          "SELECT * FROM post_links WHERE post_id = $1 ORDER BY sort_order",
          [post.id]
        )
        return { ...post, media, links }
      })
    )

    return postsWithMedia
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export default async function HomePage() {
  const posts = await getPosts()
  
  const announcements = posts.filter(p => p.post_type === "announcement")
  const ads = posts.filter(p => p.post_type === "ad")
  const regularPosts = posts.filter(p => p.post_type === "post")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section with Background Image and Announcements */}
      <HeroSection announcements={announcements} />
      
      {/* Posts Section */}
      <main className="flex-1 py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Latest Posts
            </h2>
            <p className="text-muted-foreground mt-1">
              News about EcoActive students&apos; activities
            </p>
          </div>
          <PostsList posts={regularPosts} />
        </div>
      </main>
      
      <Footer />
      
      {/* Ad Popup */}
      <AdPopupWrapper ads={ads} />
    </div>
  )
}
