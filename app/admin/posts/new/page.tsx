import { getCurrentAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"

export default async function NewPostPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <PostEditor />
    </div>
  )
}
