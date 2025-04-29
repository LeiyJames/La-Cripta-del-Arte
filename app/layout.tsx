import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Echoes of Sorrow | Art Gallery",
  description: "A gallery of sorrowful, poetic art focused on grief, longing, and emotional rawness",
  keywords: ["art", "gallery", "sorrow", "grief", "emotion", "paintings"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} bg-smudged-black text-faded-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
