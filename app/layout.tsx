import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { setupApp } from "./setup"

// Run setup
setupApp().catch(console.error)

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modern Art Gallery",
  description: "A creative, modern artwork gallery website with a dark theme and neon accents",
  keywords: ["art", "gallery", "modern", "digital", "painting", "sculpture", "photography"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
