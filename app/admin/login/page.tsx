import { LoginForm } from "@/components/admin/login-form"
import { getCurrentAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin()
  
  if (admin) {
    redirect("/admin")
  }

  return <LoginForm />
}
