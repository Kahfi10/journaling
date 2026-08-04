// src/app/(admin)/layout.tsx
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <AdminSidebar />
      <main className="flex-1 ml-60 p-10 min-h-screen">
        {children}
      </main>
    </div>
  )
}
