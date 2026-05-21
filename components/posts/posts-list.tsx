"use client"

import { PostCard } from "./post-card"
import type { PostWithMedia } from "@/lib/types"
import { Leaf } from "lucide-react"

interface PostsListProps {
  posts: PostWithMedia[]
}

export function PostsList({ posts }: PostsListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <Leaf className="w-16 h-16 mx-auto text-primary/30 mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">
          Hozircha postlar mavjud emas
        </h3>
        <p className="text-muted-foreground mt-2">
          Tez orada yangi ekologik faoliyatlar haqida xabarlar joylashtiriladi
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
