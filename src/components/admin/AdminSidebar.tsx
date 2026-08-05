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
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col z-40" style={{
      background: "var(--j-surface)",
      borderRight: "1px solid var(--j-border)",
    }}>
      {/* Logo */}
      <div className="px-6 py-7" style={{ borderBottom: "1px solid var(--j-border)" }}>
        <Link href="/" className="block">
          <span className="text-base font-semibold tracking-tight" style={{ color: "var(--j-text-1)", letterSpacing: "-0.02em" }}>
            Journal
          </span>
        </Link>
        <p className="text-[10px] mt-0.5 tracking-widest uppercase font-mono-custom" style={{ color: "var(--j-text-3)" }}>
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive
                  ? "font-medium"
                  : "hover:opacity-60"
              )}
              style={{
                background: isActive ? "var(--j-bg-alt)" : "transparent",
                color: isActive ? "var(--j-text-1)" : "var(--j-text-2)",
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5" style={{ borderTop: "1px solid var(--j-border)", paddingTop: "12px" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm w-full transition-opacity hover:opacity-60"
          style={{ color: "var(--j-text-3)" }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
