import { MediaCarousel } from "./media-carousel"
import type { PostWithMedia } from "@/lib/types"
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from "@/lib/types"
import { ExternalLink, Pin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { uz } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: PostWithMedia
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: uz,
  })

  return (
    <article className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow h-fit">
      {/* Header with type badge */}
      <div className="p-4 md:p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {post.post_type !== "post" && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                POST_TYPE_COLORS[post.post_type]
              )}>
                {POST_TYPE_LABELS[post.post_type]}
              </span>
            )}
            {post.pinned && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" />
                Muhim
              </span>
            )}
          </div>
          <time className="text-xs text-muted-foreground whitespace-nowrap">
            {formattedDate}
          </time>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight">
          {post.title}
        </h2>
      </div>

      {/* Media carousel */}
      {post.media && post.media.length > 0 && (
        <MediaCarousel media={post.media} className="mx-4 md:mx-5" />
      )}

      {/* Content */}
      {post.content && (
        <div
          className="p-4 md:p-5 pt-4 prose prose-sm max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Links */}
      {post.links && post.links.length > 0 && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 flex flex-wrap gap-2">
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
