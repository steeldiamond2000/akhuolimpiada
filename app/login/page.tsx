import { Header } from "@/components/landing/header"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  )
}
