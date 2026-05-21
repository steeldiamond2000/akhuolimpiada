import { Header } from "@/components/landing/header"
import { PostsList } from "@/components/posts/posts-list"
import { Footer } from "@/components/landing/footer"
import { query } from "@/lib/db"
import type { Post, PostMedia, PostLink, PostWithMedia } from "@/lib/types"

async function getPosts(): Promise<PostWithMedia[]> {
  try {
    const posts = await query<Post>(
      "SELECT * FROM posts WHERE published = true ORDER BY created_at DESC"
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Al-Xorazmiy Universitetida ekologik tadbirlar
            </h1>
            <p className="text-muted-foreground mt-2">
              Ekofaol talabalar faoliyati va ekologik tadbirlar haqida so&apos;nggi yangiliklar
            </p>
          </div>
          <PostsList posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
