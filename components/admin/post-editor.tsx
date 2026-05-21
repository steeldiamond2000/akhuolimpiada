"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "./rich-text-editor"
import { MediaUploader, type MediaItem } from "./media-uploader"
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Link as LinkIcon,
  Plus,
  X,
  Loader2
} from "lucide-react"
import type { PostWithMedia } from "@/lib/types"

interface PostLink {
  id: string
  title: string
  url: string
}

interface PostEditorProps {
  post?: PostWithMedia
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [published, setPublished] = useState(post?.published ?? true)
  const [media, setMedia] = useState<MediaItem[]>(
    post?.media?.map((m) => ({
      id: String(m.id),
      type: m.media_type,
      url: m.url,
      caption: m.caption || undefined,
    })) || []
  )
  const [links, setLinks] = useState<PostLink[]>(
    post?.links?.map((l) => ({
      id: String(l.id),
      title: l.title,
      url: l.url,
    })) || []
  )

  const addLink = () => {
    setLinks([
      ...links,
      { id: `new-${Date.now()}`, title: "", url: "" },
    ])
  }

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  const removeLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert("Sarlavha kiritilishi shart!")
      return
    }

    setSaving(true)

    try {
      // Prepare form data for file uploads
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("published", String(published))
      
      // Add media info
      const mediaInfo = media.map((m, index) => ({
        type: m.type,
        url: m.file ? `__FILE_${index}__` : m.url,
        caption: m.caption || "",
      }))
      formData.append("media", JSON.stringify(mediaInfo))
      
      // Add actual files
      media.forEach((m, index) => {
        if (m.file) {
          formData.append(`file_${index}`, m.file)
        }
      })

      // Add links
      formData.append(
        "links",
        JSON.stringify(links.filter((l) => l.title && l.url))
      )

      const url = post ? `/api/posts/${post.id}` : "/api/posts"
      const method = post ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Xatolik yuz berdi")
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xatolik yuz berdi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              published
                ? "border-green-500 text-green-600 bg-green-50"
                : "border-border text-muted-foreground"
            }`}
          >
            {published ? (
              <>
                <Eye className="w-4 h-4" />
                Chop etilgan
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Qoralama
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Saqlash
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Sarlavha *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Post sarlavhasini kiriting..."
          className="w-full px-4 py-3 text-lg border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Media */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Media (rasmlar, videolar)
        </label>
        <MediaUploader media={media} onChange={setMedia} />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Matn
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Post matnini yozing..."
        />
      </div>

      {/* Links */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-foreground">
            Havolalar
          </label>
          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" />
            Havola qo&apos;shish
          </button>
        </div>

        {links.length > 0 && (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(link.id, "title", e.target.value)}
                    placeholder="Havola nomi"
                    className="px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    placeholder="https://..."
                    className="px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  )
}
