import { getCurrentAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { query } from "@/lib/db"
import type { Post, PostMedia, PostLink, PostWithMedia } from "@/lib/types"

async function getPosts(): Promise<PostWithMedia[]> {
  const posts = await query<Post>(
    "SELECT * FROM posts ORDER BY pinned DESC, created_at DESC"
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
}

export default async function AdminPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  const posts = await getPosts()

  return <AdminDashboard posts={posts} adminName={admin.full_name || admin.username} />
}
