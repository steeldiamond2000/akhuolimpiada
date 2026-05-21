export interface Admin {
  id: number
  username: string
  password_hash: string
  full_name: string | null
  created_at: Date
  updated_at: Date
}

export type PostType = "post" | "ad" | "announcement"

export interface Post {
  id: number
  title: string
  content: string | null
  post_type: PostType
  published: boolean
  pinned: boolean
  created_at: Date
  updated_at: Date
  created_by: number | null
}

export interface PostMedia {
  id: number
  post_id: number
  media_type: "image" | "youtube" | "panorama"
  url: string
  thumbnail_url: string | null
  caption: string | null
  sort_order: number
  created_at: Date
}

export interface PostLink {
  id: number
  post_id: number
  title: string
  url: string
  sort_order: number
}

export interface PostWithMedia extends Post {
  media: PostMedia[]
  links: PostLink[]
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  post: "Post",
  ad: "Reklama",
  announcement: "E'lon",
}

export const POST_TYPE_COLORS: Record<PostType, string> = {
  post: "bg-primary/10 text-primary",
  ad: "bg-amber-100 text-amber-800",
  announcement: "bg-green-100 text-green-800",
}
