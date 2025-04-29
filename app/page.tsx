import { Suspense } from "react"
import { getArtworks, getArtists, getCategories, getFeaturedArtworks } from "./actions"
import { SorrowfulBackground } from "@/components/sorrowful-background"
import ClientPage from "./client-page" // Changed from named import to default import

export const revalidate = 0

export default async function Home() {
  // Fetch data in parallel
  const [artworks, artists, categories, featuredArtworks] = await Promise.all([
    getArtworks(),
    getArtists(),
    getCategories(),
    getFeaturedArtworks(),
  ])

  return (
    <main className="min-h-screen bg-smudged-black text-faded-white">
      <SorrowfulBackground />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <ClientPage
          initialArtworks={artworks}
          artists={artists}
          categories={categories}
          featuredArtworks={featuredArtworks}
        />
      </Suspense>
    </main>
  )
}
