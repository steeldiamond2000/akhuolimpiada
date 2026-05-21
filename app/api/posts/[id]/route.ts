import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { getCurrentAdmin } from "@/lib/auth"
import type { Post } from "@/lib/types"
import { put } from "@vercel/blob"

interface RouteParams {
  params: Promise<{ id: string }>
}

// PUT - Update post
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const postId = parseInt(id)

    const existingPost = await queryOne<Post>(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    )
    if (!existingPost) {
      return NextResponse.json({ error: "Post topilmadi" }, { status: 404 })
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

    // Update post
    await query(
      `UPDATE posts SET title = $1, content = $2, published = $3
       WHERE id = $4`,
      [title, content, published, postId]
    )

    // Update media - delete old and insert new
    await query("DELETE FROM post_media WHERE post_id = $1", [postId])

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
            const blob = await put(`posts/${postId}/${Date.now()}-${file.name}`, file, {
              access: "public",
            })
            url = blob.url
          }
        }
      }

      await query(
        `INSERT INTO post_media (post_id, media_type, url, caption, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [postId, item.type, url, item.caption || null, i]
      )
    }

    // Update links - delete old and insert new
    await query("DELETE FROM post_links WHERE post_id = $1", [postId])

    const linkItems = JSON.parse(linksJson || "[]")
    for (let i = 0; i < linkItems.length; i++) {
      const link = linkItems[i]
      await query(
        `INSERT INTO post_links (post_id, title, url, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [postId, link.title, link.url, i]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const postId = parseInt(id)

    // Media and links will be deleted by CASCADE
    await query("DELETE FROM posts WHERE id = $1", [postId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
