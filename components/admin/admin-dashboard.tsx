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
  LogOut,
  Leaf,
  Pin,
  Megaphone,
  FileText,
  Bell
} from "lucide-react"
import type { PostWithMedia } from "@/lib/types"
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AdminDashboardProps {
  posts: PostWithMedia[]
  adminName: string
}

export function AdminDashboard({ posts, adminName }: AdminDashboardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "post" | "ad" | "announcement">("all")

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
    } catch {
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
      formData.append("post_type", post.post_type)
      formData.append("published", String(!post.published))
      formData.append("pinned", String(post.pinned))
      formData.append("media", JSON.stringify([]))
      formData.append("links", JSON.stringify([]))

      await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      })
      router.refresh()
    } catch {
      alert("Xatolik yuz berdi")
    }
  }

  const filteredPosts = filter === "all" 
    ? posts 
    : posts.filter(p => p.post_type === filter)

  const counts = {
    all: posts.length,
    post: posts.filter(p => p.post_type === "post").length,
    ad: posts.filter(p => p.post_type === "ad").length,
    announcement: posts.filter(p => p.post_type === "announcement").length,
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
              <span className="hidden sm:inline">Saytni ko&apos;rish</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/posts/new?type=post"
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Yangi Post</h3>
              <p className="text-sm text-muted-foreground">Yangilik yoki maqola</p>
            </div>
          </Link>
          
          <Link
            href="/admin/posts/new?type=ad"
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-amber-500/50 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Yangi Reklama</h3>
              <p className="text-sm text-muted-foreground">Reklama yoki targ&apos;ibot</p>
            </div>
          </Link>
          
          <Link
            href="/admin/posts/new?type=announcement"
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-green-500/50 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Yangi E&apos;lon</h3>
              <p className="text-sm text-muted-foreground">Muhim xabar yoki e&apos;lon</p>
            </div>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "post", "ad", "announcement"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-muted"
              )}
            >
              {type === "all" && "Barchasi"}
              {type === "post" && "Postlar"}
              {type === "ad" && "Reklamalar"}
              {type === "announcement" && "E'lonlar"}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs",
                filter === type ? "bg-white/20" : "bg-muted"
              )}>
                {counts[type]}
              </span>
            </button>
          ))}
        </div>

        {/* Posts list */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Leaf className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              {filter === "all" ? "Hozircha postlar mavjud emas" : `${filter === "post" ? "Postlar" : filter === "ad" ? "Reklamalar" : "E'lonlar"} topilmadi`}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Yangi kontent qo&apos;shing
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-xl border border-border p-4 md:p-5 flex flex-col md:flex-row gap-4"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-40 h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          POST_TYPE_COLORS[post.post_type]
                        )}>
                          {POST_TYPE_LABELS[post.post_type]}
                        </span>
                        {post.pinned && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Pin className="w-3 h-3" />
                            Muhim
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                            locale: uz,
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {post.title}
                      </h3>
                    </div>

                    {/* Status badge */}
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
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
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {stripHtml(post.content)}
                    </p>
                  )}

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between mt-3 gap-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.media && post.media.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" />
                          {post.media.length} media
                        </span>
                      )}
                      {post.links && post.links.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          {post.links.length} link
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tahrirlash</span>
                      </Link>
                      <button
                        onClick={() => togglePublished(post)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        {post.published ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
