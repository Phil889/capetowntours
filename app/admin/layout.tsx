import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <main className="py-8">{children}</main>
    </div>
  )
}
