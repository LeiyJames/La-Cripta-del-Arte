"use client"

import { useState } from "react"
import Link from "next/link"
import type { Artwork, Artist, Category } from "@/types"
import { Gallery } from "@/components/gallery"
import { FilterPanel } from "@/components/filter-panel"
import { UploadForm } from "@/components/upload-form"
import { FeaturedArtwork } from "@/components/featured-artwork"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

interface ClientPageProps {
  initialArtworks: Artwork[]
  artists: Artist[]
  categories: Category[]
  featuredArtworks: Artwork[]
}

export default function ClientPage({ initialArtworks, artists, categories, featuredArtworks }: ClientPageProps) {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false)

  // Filter artworks based on selected artist and category
  const filteredArtworks = initialArtworks.filter((artwork) => {
    const artistMatch = selectedArtist ? artwork.artist_id === selectedArtist : true
    const categoryMatch = selectedCategory ? artwork.category_id === selectedCategory : true
    return artistMatch && categoryMatch
  })

  return (
    <div className="relative z-0">
      <header className="bg-smudged-black/80 backdrop-blur-md border-b border-bruised-purple/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-playfair font-light sorrowful-gradient">La Cripta del Arte</h1>
          <div className="flex items-center space-x-2">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="hidden sm:flex border-bruised-purple/30 bg-transparent"
            >
              <Link href="/admin" aria-label="Admin Dashboard">
                <Settings className="h-4 w-4 text-teardrop" />
              </Link>
            </Button>
            <Button onClick={() => setIsUploadFormOpen(true)} className="btn-sorrowful">
              <Plus className="mr-2 h-4 w-4" /> Upload Artwork
            </Button>
          </div>
        </div>
      </header>

      {featuredArtworks.length > 0 && <FeaturedArtwork artwork={featuredArtworks[0]} />}

      <FilterPanel
        artists={artists}
        categories={categories}
        selectedArtist={selectedArtist}
        selectedCategory={selectedCategory}
        onArtistChange={setSelectedArtist}
        onCategoryChange={setSelectedCategory}
      />

      {filteredArtworks.length > 0 ? (
        <Gallery artworks={filteredArtworks} />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-xl font-playfair font-light mb-2 sorrowful-gradient">No artworks found</h2>
          <p className="text-faded-white opacity-70 mb-6">
            No artworks match your current filter criteria. Try changing your filters or upload a new artwork.
          </p>
          <Button onClick={() => setIsUploadFormOpen(true)} className="btn-sorrowful">
            <Plus className="mr-2 h-4 w-4" /> Upload Artwork
          </Button>
        </div>
      )}

      <UploadForm
        isOpen={isUploadFormOpen}
        onClose={() => setIsUploadFormOpen(false)}
        artists={artists}
        categories={categories}
      />

      <Toaster />
    </div>
  )
}
