"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutGrid, PlusSquare, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Semua Entry", icon: LayoutGrid },
  { href: "/admin/entries/new", label: "Buat Baru", icon: PlusSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#111111] border-r border-[#2A2A2A] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#2A2A2A]">
        <Link href="/" className="font-display text-xl font-semibold text-[#F0EDE8] hover:text-[#C8A96E] transition-colors">
          Journal
        </Link>
        <p className="text-[#555555] text-[11px] font-sans tracking-widest uppercase mt-1">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans transition-colors",
                isActive
                  ? "bg-[#C8A96E]/15 text-[#C8A96E]"
                  : "text-[#888888] hover:text-[#F0EDE8] hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 border-t border-[#2A2A2A] pt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans text-[#555555] hover:text-[#FF4D4D] hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
