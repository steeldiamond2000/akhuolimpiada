import { getCurrentAdmin } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { query, queryOne } from "@/lib/db"
import type { Post, PostMedia, PostLink, PostWithMedia } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPost(id: number): Promise<PostWithMedia | null> {
  const post = await queryOne<Post>("SELECT * FROM posts WHERE id = $1", [id])
  if (!post) return null

  const media = await query<PostMedia>(
    "SELECT * FROM post_media WHERE post_id = $1 ORDER BY sort_order",
    [id]
  )
  const links = await query<PostLink>(
    "SELECT * FROM post_links WHERE post_id = $1 ORDER BY sort_order",
    [id]
  )

  return { ...post, media, links }
}

export default async function EditPostPage({ params }: PageProps) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  const { id } = await params
  const post = await getPost(parseInt(id))

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <PostEditor post={post} />
    </div>
  )
}
