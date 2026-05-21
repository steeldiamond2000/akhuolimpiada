"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Youtube,
  ExternalLink,
  MoreVertical,
  LogOut,
  Leaf
} from "lucide-react"
import type { PostWithMedia } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { useState } from "react"

interface AdminDashboardProps {
  posts: PostWithMedia[]
  adminName: string
}

export function AdminDashboard({ posts, adminName }: AdminDashboardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham bu postni o'chirmoqchimisiz?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      alert("O'chirishda xatolik yuz berdi")
    } finally {
      setDeleting(null)
    }
  }

  const togglePublished = async (post: PostWithMedia) => {
    try {
      const formData = new FormData()
      formData.append("title", post.title)
      formData.append("content", post.content || "")
      formData.append("published", String(!post.published))
      formData.append("media", JSON.stringify([]))
      formData.append("links", JSON.stringify([]))

      await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      })
      router.refresh()
    } catch (err) {
      alert("Xatolik yuz berdi")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">EcoFaol Admin</h1>
              <p className="text-xs text-muted-foreground">{adminName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Saytni ko&apos;rish
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Postlar</h2>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi post
          </Link>
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Leaf className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              Hozircha postlar mavjud emas
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Birinchi postingizni yarating
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Post yaratish
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-xl border border-border p-4 md:p-6 flex flex-col md:flex-row gap-4"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {post.media && post.media.length > 0 ? (
                    post.media[0].media_type === "youtube" ? (
                      <div className="relative w-full h-full">
                        <img
                          src={`https://img.youtube.com/vi/${extractYoutubeId(post.media[0].url)}/mqdefault.jpg`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={post.media[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                            locale: uz,
                          })}
                        </span>
                        {post.media && post.media.length > 0 && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {post.media.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Faol
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Qoralama
                        </>
                      )}
                    </div>
                  </div>

                  {/* Preview text */}
                  {post.content && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {stripHtml(post.content)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Tahrirlash
                    </Link>
                    <button
                      onClick={() => togglePublished(post)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      {post.published ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Yashirish
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Chop etish
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting === post.id ? "..." : "O'chirish"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function extractYoutubeId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
  )
  return match?.[1] || ""
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}
