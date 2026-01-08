import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.is_admin) {
    redirect("/dashboard")
  }

  return <AdminDashboard userName={user.fio} />
}
