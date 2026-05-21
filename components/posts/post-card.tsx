import { MediaCarousel } from "./media-carousel"
import type { PostWithMedia } from "@/lib/types"
import { ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"

interface PostCardProps {
  post: PostWithMedia
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: uz,
  })

  return (
    <article className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Title */}
      <div className="p-4 md:p-6 pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
          {post.title}
        </h2>
        <time className="text-sm text-muted-foreground mt-1 block">
          {formattedDate}
        </time>
      </div>

      {/* Media carousel */}
      {post.media && post.media.length > 0 && (
        <MediaCarousel media={post.media} className="mx-4 md:mx-6" />
      )}

      {/* Content */}
      {post.content && (
        <div
          className="p-4 md:p-6 pt-4 prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Links */}
      {post.links && post.links.length > 0 && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-wrap gap-2">
          {post.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {link.title}
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
