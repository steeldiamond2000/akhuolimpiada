import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { getCurrentAdmin } from "@/lib/auth"
import type { Post, PostMedia, PostLink, PostWithMedia } from "@/lib/types"
import { put } from "@vercel/blob"

// GET - Public endpoint for fetching published posts
export async function GET() {
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

    return NextResponse.json(postsWithMedia)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}

// POST - Create new post (admin only)
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "true"
    const mediaJson = formData.get("media") as string
    const linksJson = formData.get("links") as string

    if (!title) {
      return NextResponse.json(
        { error: "Sarlavha kiritilishi shart" },
        { status: 400 }
      )
    }

    // Create post
    const [post] = await query<Post>(
      `INSERT INTO posts (title, content, published, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, published, admin.id]
    )

    // Handle media
    const mediaItems = JSON.parse(mediaJson || "[]")
    for (let i = 0; i < mediaItems.length; i++) {
      const item = mediaItems[i]
      let url = item.url

      // Check if this is a file upload placeholder
      if (url.startsWith("__FILE_")) {
        const fileIndex = url.match(/__FILE_(\d+)__/)?.[1]
        if (fileIndex !== undefined) {
          const file = formData.get(`file_${fileIndex}`) as File
          if (file) {
            // Upload to Vercel Blob
            const blob = await put(`posts/${post.id}/${Date.now()}-${file.name}`, file, {
              access: "public",
            })
            url = blob.url
          }
        }
      }

      await query(
        `INSERT INTO post_media (post_id, media_type, url, caption, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [post.id, item.type, url, item.caption || null, i]
      )
    }

    // Handle links
    const linkItems = JSON.parse(linksJson || "[]")
    for (let i = 0; i < linkItems.length; i++) {
      const link = linkItems[i]
      await query(
        `INSERT INTO post_links (post_id, title, url, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [post.id, link.title, link.url, i]
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
