import { Suspense } from "react"
import { getArtworks, getArtists, getCategories } from "./actions"
import { AnimatedBackground } from "@/components/animated-background"
import ClientPage from "./client-page"

export const revalidate = 0

export default async function Home() {
  // Fetch data in parallel
  const [artworks, artists, categories] = await Promise.all([getArtworks(), getArtists(), getCategories()])

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <AnimatedBackground />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <ClientPage initialArtworks={artworks} artists={artists} categories={categories} />
      </Suspense>
    </main>
  )
}
