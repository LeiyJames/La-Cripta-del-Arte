import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Gallery Admin</h1>
            <nav className="hidden sm:flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/setup">Setup</Link>
              </Button>
            </nav>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
