import type React from "react"
import { AdminTopNav } from "@/components/admin/AdminTopNav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminTopNav />
      <main className="w-full">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
