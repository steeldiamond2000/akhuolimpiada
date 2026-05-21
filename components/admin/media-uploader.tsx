"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { 
  X, 
  GripVertical, 
  Image as ImageIcon, 
  Youtube, 
  Panorama,
  Upload,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface MediaItem {
  id: string
  type: "image" | "youtube" | "panorama"
  url: string
  caption?: string
  file?: File
}

interface MediaUploaderProps {
  media: MediaItem[]
  onChange: (media: MediaItem[]) => void
}

export function MediaUploader({ media, onChange }: MediaUploaderProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newMedia: MediaItem[] = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "image" as const,
        url: URL.createObjectURL(file),
        file,
      }))
      onChange([...media, ...newMedia])
    },
    [media, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: true,
  })

  const addYoutubeVideo = () => {
    if (!youtubeUrl.trim()) return

    const youtubeId = extractYoutubeId(youtubeUrl)
    if (!youtubeId) {
      alert("Noto'g'ri YouTube URL")
      return
    }

    const newItem: MediaItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "youtube",
      url: youtubeUrl,
    }

    onChange([...media, newItem])
    setYoutubeUrl("")
    setShowYoutubeInput(false)
  }

  const extractYoutubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    )
    return match?.[1] || null
  }

  const removeMedia = (id: string) => {
    onChange(media.filter((item) => item.id !== id))
  }

  const updateCaption = (id: string, caption: string) => {
    onChange(
      media.map((item) => (item.id === id ? { ...item, caption } : item))
    )
  }

  const moveMedia = (fromIndex: number, toIndex: number) => {
    const newMedia = [...media]
    const [removed] = newMedia.splice(fromIndex, 1)
    newMedia.splice(toIndex, 0, removed)
    onChange(newMedia)
  }

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Rasmlarni shu yerga tashlang..."
            : "Rasmlarni bu yerga tortib tashlang yoki bosing"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, GIF, WEBP formatlar qo&apos;llab-quvvatlanadi
        </p>
      </div>

      {/* Add buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowYoutubeInput(!showYoutubeInput)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <Youtube className="w-4 h-4 text-red-500" />
          YouTube video
        </button>
      </div>

      {/* YouTube URL input */}
      {showYoutubeInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={addYoutubeVideo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
          >
            Qo&apos;shish
          </button>
        </div>
      )}

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="relative group border border-border rounded-lg overflow-hidden bg-muted/30"
            >
              {/* Preview */}
              <div className="aspect-video relative">
                {item.type === "youtube" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${extractYoutubeId(item.url)}/mqdefault.jpg`}
                      alt="YouTube thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <Youtube className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption || `Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeMedia(item.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Index badge */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>

                {/* Type badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white rounded text-xs">
                  {item.type === "youtube" ? "Video" : "Rasm"}
                </div>
              </div>

              {/* Caption input */}
              <div className="p-2">
                <input
                  type="text"
                  value={item.caption || ""}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  placeholder="Izoh (ixtiyoriy)"
                  className="w-full px-2 py-1 text-xs border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {media.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Jami: {media.length} ta media. Tartibni o&apos;zgartirish uchun tortib o&apos;tkazing.
        </p>
      )}
    </div>
  )
}
