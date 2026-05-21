import { Header } from "@/components/landing/header"
import { PostsList } from "@/components/posts/posts-list"
import { AnnouncementsBanner } from "@/components/posts/announcements-banner"
import { Footer } from "@/components/landing/footer"
import { query } from "@/lib/db"
import type { Post, PostMedia, PostLink, PostWithMedia } from "@/lib/types"

async function getPosts(): Promise<PostWithMedia[]> {
  try {
    const posts = await query<Post>(
      `SELECT * FROM posts WHERE published = true 
       ORDER BY pinned DESC, 
       CASE WHEN post_type = 'announcement' THEN 0 WHEN post_type = 'ad' THEN 1 ELSE 2 END,
       created_at DESC`
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
  const regularPosts = posts.filter(p => p.post_type !== "announcement")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <AnnouncementsBanner announcements={announcements} />
      )}
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Al-Xorazmiy Universitetida ekologik tadbirlar
            </h1>
            <p className="text-muted-foreground mt-2">
              Ekofaol talabalar faoliyati va ekologik tadbirlar haqida so&apos;nggi yangiliklar
            </p>
          </div>
          <PostsList posts={regularPosts} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
