// src/app/(admin)/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError("Email atau password salah")
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--j-bg)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-2xl font-semibold tracking-tight" style={{ color: "var(--j-text-1)", letterSpacing: "-0.03em" }}>
            Journal
          </span>
          <p className="text-xs mt-1.5 tracking-widest uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
            Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium tracking-widest uppercase mb-1.5" style={{ color: "var(--j-text-2)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-base w-full"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-widest uppercase mb-1.5" style={{ color: "var(--j-text-2)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-base w-full"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-opacity disabled:opacity-50 mt-1"
            style={{ background: "var(--j-text-1)", color: "var(--j-white)" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Masuk
          </button>
        </form>
      </div>
    </main>
  )
}
