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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Email atau password salah")
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-3xl font-semibold text-[#F0EDE8]">Journal</span>
          <p className="text-[#555555] text-sm font-sans mt-2 tracking-wider">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#888888] text-xs font-sans tracking-widest uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm px-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-[#888888] text-xs font-sans tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#F0EDE8] text-sm px-4 py-3 focus:outline-none focus:border-[#C8A96E] transition-colors font-sans"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[#FF4D4D] text-sm font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8A96E] text-[#0A0A0A] font-sans font-semibold text-sm py-3 rounded hover:bg-[#D4B87A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Masuk
          </button>
        </form>
      </div>
    </main>
  )
}
